// Every outward action (channel post, chat repost, partner message, Instagram post/story) goes through approval:
// a preview is sent to you and the action runs only after an explicit ✅.
//
// With TELEGRAM_APPROVAL_CHAT_ID set, the bot sends the preview (image + text + where it goes) to that chat with
// ✅ / ❌ buttons and waits for the tap — approve from the phone. Otherwise it asks in the terminal.
// No answer = no action: a timeout counts as ❌.
//
// ❌ on an editable action (one with onEdit) opens a small dialogue:
//   «✏️ Что поправить?» — reply to the preview with text and/or a photo → the event is rebuilt and the preview comes
//   again; [🗑 Отменить анонс] drops every action of that event; [⏭ Только пропустить] skips just this one.

import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';

const APPROVAL_TIMEOUT_MS = 6 * 60 * 60 * 1000;
const CAPTION_LIMIT = 1024; // Telegram photo caption limit

// Action fields may be functions so the preview always shows the current (possibly edited) version.
const value = (field) => (typeof field === 'function' ? field() : field);

async function telegram(method, body, isForm = false) {
  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    ...(isForm ? { body } : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  });
  const json = await response.json();
  if (!json.ok) throw new Error(`${method}: ${json.description}`);
  return json.result;
}

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function previewText(action) {
  const head = `<b>Подтвердить?</b>\n${escapeHtml(value(action.label))}`;
  const body = value(action.text) ?? '';
  // Telegram counts the caption without HTML tags, so the tags of the body don't eat the room.
  const tags = body.length - body.replace(/<[^>]+>/g, '').length;
  const room = CAPTION_LIMIT - head.length - 10 + tags;
  // The body is already HTML (channel caption); cut on a line break so no tag is left half-open.
  const cut = body.length > room ? `${body.slice(0, body.lastIndexOf('\n', room) > 0 ? body.lastIndexOf('\n', room) : room)}\n…` : body;
  return `${head}\n\n${cut}`;
}

let updateOffset;
let downloadDir;

async function nextUpdates() {
  if (updateOffset === undefined) {
    const last = await telegram('getUpdates', { offset: -1, timeout: 0 });
    updateOffset = last.length ? last[last.length - 1].update_id + 1 : 0;
  }
  const updates = await telegram('getUpdates', {
    offset: updateOffset,
    timeout: 50,
    allowed_updates: ['callback_query', 'message']
  });
  for (const update of updates) updateOffset = update.update_id + 1;
  return updates;
}

async function downloadPhoto(message) {
  const fileId = message.photo?.at(-1)?.file_id ?? (/^image\//.test(message.document?.mime_type ?? '') ? message.document.file_id : null);
  if (!fileId) return null;
  const file = await telegram('getFile', { file_id: fileId });
  const response = await fetch(`https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`);
  downloadDir ??= await mkdtemp(join(tmpdir(), 'omhome-edit-'));
  const path = join(downloadDir, `${Date.now()}-${file.file_path.split('/').pop()}`);
  await writeFile(path, Buffer.from(await response.arrayBuffer()));
  return path;
}

async function setButtons(chatId, messageId, rows) {
  await telegram('editMessageReplyMarkup', { chat_id: chatId, message_id: messageId, reply_markup: { inline_keyboard: rows } });
}

// → { decision: 'yes' | 'skip' | 'cancel' | 'edit', text?, photo? }
async function askTelegram(action, id) {
  const chatId = process.env.TELEGRAM_APPROVAL_CHAT_ID;
  const keyboard = {
    inline_keyboard: [[
      { text: '✅ Опубликовать', callback_data: `${id}|y` },
      { text: action.onEdit ? '❌ Нет / поправить' : '❌ Пропустить', callback_data: `${id}|n` }
    ]]
  };

  let preview;
  const image = value(action.image);
  if (image) {
    const form = new FormData();
    form.set('chat_id', chatId);
    form.set('caption', previewText(action));
    form.set('parse_mode', 'HTML');
    form.set('reply_markup', JSON.stringify(keyboard));
    form.set('photo', new Blob([await readFile(image)], { type: 'image/jpeg' }), 'preview.jpg');
    preview = await telegram('sendPhoto', form, true);
  } else {
    preview = await telegram('sendMessage', { chat_id: chatId, text: previewText(action), parse_mode: 'HTML', reply_markup: keyboard });
  }

  let prompt; // the «Что поправить?» message, once ❌ was pressed
  const deadline = Date.now() + APPROVAL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    for (const update of await nextUpdates()) {
      const query = update.callback_query;
      if (query?.data?.startsWith(`${id}|`) && String(query.message?.chat?.id) === String(chatId)) {
        const answer = query.data.slice(id.length + 1);
        if (answer === 'y') {
          await telegram('answerCallbackQuery', { callback_query_id: query.id, text: 'Публикую' });
          await setButtons(chatId, preview.message_id, [[{ text: '✅ Одобрено', callback_data: 'done' }]]);
          return { decision: 'yes' };
        }
        if (answer === 'n' && action.onEdit && !prompt) {
          await telegram('answerCallbackQuery', { callback_query_id: query.id, text: 'Что поправить?' });
          await setButtons(chatId, preview.message_id, [[{ text: '✏️ Ждёт правок…', callback_data: 'done' }]]);
          prompt = await telegram('sendMessage', {
            chat_id: chatId,
            reply_to_message_id: preview.message_id,
            text: '✏️ Что поправить в анонсе? Ответь реплаем на это сообщение — текстом и/или с фото для афиши.',
            reply_markup: {
              inline_keyboard: [[
                { text: '🗑 Отменить анонс', callback_data: `${id}|c` },
                { text: '⏭ Только пропустить', callback_data: `${id}|s` }
              ]]
            }
          });
          continue;
        }
        const cancel = answer === 'c';
        await telegram('answerCallbackQuery', { callback_query_id: query.id, text: cancel ? 'Анонс отменён' : 'Пропускаю' });
        await setButtons(chatId, (prompt ?? preview).message_id, [
          [{ text: cancel ? '🗑 Анонс отменён' : '⏭ Пропущено', callback_data: 'done' }]
        ]);
        if (!prompt) await setButtons(chatId, preview.message_id, [[{ text: '❌ Пропущено', callback_data: 'done' }]]);
        return { decision: cancel ? 'cancel' : 'skip' };
      }

      // A reply with the edit: to the «Что поправить?» message or to the preview itself.
      const message = update.message;
      const repliedTo = message?.reply_to_message?.message_id;
      if (
        prompt &&
        String(message?.chat?.id) === String(chatId) &&
        (repliedTo === prompt.message_id || repliedTo === preview.message_id)
      ) {
        const text = (message.text ?? message.caption ?? '').trim();
        const photo = await downloadPhoto(message);
        if (!text && !photo) continue;
        await setButtons(chatId, prompt.message_id, [[{ text: '🛠 Вношу правки…', callback_data: 'done' }]]);
        return { decision: 'edit', text, photo };
      }
    }
  }
  return { decision: 'skip' };
}

// Asks for a photo in the approval chat: any photo sent as a reply to this message (or right after it) is taken.
// → path of the downloaded photo, or null (⏭ button, timeout, no Telegram).
export async function requestPhoto(text) {
  const chatId = process.env.TELEGRAM_APPROVAL_CHAT_ID;
  if (!chatId || !process.env.TELEGRAM_BOT_TOKEN) return null;
  const id = `p${Date.now().toString(36)}`;
  const ask = await telegram('sendMessage', {
    chat_id: chatId,
    text,
    reply_markup: { inline_keyboard: [[{ text: '⏭ Без этого события', callback_data: `${id}|s` }]] }
  });
  const deadline = Date.now() + APPROVAL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    for (const update of await nextUpdates()) {
      const query = update.callback_query;
      if (query?.data === `${id}|s`) {
        await telegram('answerCallbackQuery', { callback_query_id: query.id, text: 'Пропускаю' });
        await setButtons(chatId, ask.message_id, [[{ text: '⏭ Пропущено', callback_data: 'done' }]]);
        return null;
      }
      const message = update.message;
      if (String(message?.chat?.id) !== String(chatId)) continue;
      const photo = await downloadPhoto(message);
      if (photo) {
        await setButtons(chatId, ask.message_id, [[{ text: '🖼 Фото получено', callback_data: 'done' }]]);
        return photo;
      }
    }
  }
  return null;
}

export async function notify(text) {
  if (process.env.TELEGRAM_APPROVAL_CHAT_ID && process.env.TELEGRAM_BOT_TOKEN) {
    await telegram('sendMessage', { chat_id: process.env.TELEGRAM_APPROVAL_CHAT_ID, text }).catch(() => undefined);
  }
  console.log(text);
}

// One readline for the whole run: a fresh interface per question would drop answers already buffered from stdin.
let terminal;
const lines = [];
let waiting;
let closed = false;

async function readLine(question) {
  if (!terminal) {
    terminal = createInterface({ input: process.stdin });
    terminal.on('line', (line) => (waiting ? (waiting(line), (waiting = undefined)) : lines.push(line)));
    terminal.on('close', () => {
      closed = true;
      waiting?.('');
    });
  }
  process.stdout.write(question);
  // No more input (closed stdin) counts as "no".
  return lines.length ? lines.shift() : closed ? '' : await new Promise((resolve) => (waiting = resolve));
}

// Terminal: y — publish; n / Enter — skip; c — cancel the announcement; anything else — an edit
// (text, or «фото: /path/to/photo.jpg»).
async function askTerminal(action) {
  const image = value(action.image);
  console.log(`\n┌ ${value(action.label)}${image ? `\n│ 🖼  ${image}` : ''}\n${(value(action.text) ?? '').replace(/^/gm, '│ ')}`);
  const answer = (await readLine(`└ Опубликовать? [y/N${action.onEdit ? ', c — отменить анонс, или напишите правку' : ''}] `)).trim();
  if (/^(y|yes|д|да)$/i.test(answer)) return { decision: 'yes' };
  if (!action.onEdit || /^(n|no|н|нет)?$/i.test(answer)) return { decision: 'skip' };
  if (/^(c|с|отмена|отменить)$/i.test(answer)) return { decision: 'cancel' };
  const photo = answer.match(/^фото:\s*(.+)$/i)?.[1];
  return { decision: 'edit', text: photo ? '' : answer, photo };
}

/**
 * Asks for approval of every action in order and runs the approved ones.
 * action: { label, text?, image?, run, group?, prepare?(), skip?(), onEdit?({ text, photo }) } — label/text/image may be functions.
 * onCancel(group) is called when an announcement is cancelled; its remaining actions are skipped.
 * Returns [{ label, status: 'done' | 'skipped' | 'cancelled' | 'failed', error? }].
 */
export async function runWithApproval(actions, { onCancel } = {}) {
  const useTelegram = Boolean(process.env.TELEGRAM_APPROVAL_CHAT_ID && process.env.TELEGRAM_BOT_TOKEN);
  const batch = Date.now().toString(36);
  const cancelled = new Set();
  const results = [];
  for (const [index, action] of actions.entries()) {
    if (action.group && cancelled.has(action.group)) {
      results.push({ label: value(action.label), status: 'cancelled' });
      continue;
    }
    if (action.skip?.()) continue;
    // Some previews are written just before they are shown (e.g. the schedule message — only the events not cancelled).
    if (action.prepare) {
      try {
        await action.prepare();
      } catch (error) {
        console.warn(`⚠️  ${value(action.label)}: ${error.message}`);
      }
    }

    let answer;
    for (let round = 0; ; round++) {
      answer = useTelegram ? await askTelegram(action, `${batch}.${index}.${round}`) : await askTerminal(action);
      if (answer.decision !== 'edit') break;
      try {
        await action.onEdit({ text: answer.text, photo: answer.photo });
        console.log(`🛠  ${value(action.label)} — правка внесена, превью заново`);
      } catch (error) {
        await notify(`⚠️ Не получилось внести правку: ${error.message}. Попробуйте сформулировать иначе.`);
      }
    }

    if (answer.decision === 'cancel') {
      cancelled.add(action.group);
      await onCancel?.(action.group);
      console.log(`🗑  ${value(action.label)} — анонс отменён`);
      results.push({ label: value(action.label), status: 'cancelled' });
      continue;
    }
    if (answer.decision !== 'yes') {
      console.log(`⏭  ${value(action.label)} — пропущено`);
      results.push({ label: value(action.label), status: 'skipped' });
      continue;
    }
    try {
      await action.run();
      console.log(`✅ ${value(action.label)}`);
      results.push({ label: value(action.label), status: 'done' });
    } catch (error) {
      // Said in the chat too: the preview already shows «✅ Одобрено», so a silent failure would look like success.
      await notify(`❌ Не получилось: ${value(action.label)}\n${error.message}`);
      results.push({ label: value(action.label), status: 'failed', error: error.message });
    }
  }
  terminal?.close();
  terminal = undefined;
  closed = false;
  lines.length = 0;
  return results;
}
