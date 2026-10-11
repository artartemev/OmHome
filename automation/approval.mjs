// Every outward action (channel post, chat repost, partner message, Instagram post/story) goes through approve():
// a preview is sent to you and the action runs only after an explicit ✅.
//
// With TELEGRAM_APPROVAL_CHAT_ID set, the bot sends the preview (image + text + where it goes) to that chat with
// ✅ / ❌ buttons and waits for the tap — approve from the phone. Otherwise it asks in the terminal.
// No answer = no action: a timeout counts as ❌.

import { readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';

const APPROVAL_TIMEOUT_MS = 6 * 60 * 60 * 1000;
const CAPTION_LIMIT = 1024; // Telegram photo caption limit

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
  const head = `<b>Подтвердить?</b>\n${escapeHtml(action.label)}`;
  const body = action.text ?? '';
  const room = CAPTION_LIMIT - head.length - 10;
  // The body is already HTML (channel caption); cut on a line break so no tag is left half-open.
  const cut = body.length > room ? `${body.slice(0, body.lastIndexOf('\n', room) > 0 ? body.lastIndexOf('\n', room) : room)}\n…` : body;
  return `${head}\n\n${cut}`;
}

let updateOffset;

async function askTelegram(action, id) {
  const chatId = process.env.TELEGRAM_APPROVAL_CHAT_ID;
  if (updateOffset === undefined) {
    const last = await telegram('getUpdates', { offset: -1, timeout: 0 });
    updateOffset = last.length ? last[last.length - 1].update_id + 1 : 0;
  }
  const keyboard = {
    inline_keyboard: [[
      { text: '✅ Опубликовать', callback_data: `${id}|y` },
      { text: '❌ Пропустить', callback_data: `${id}|n` }
    ]]
  };

  let message;
  if (action.image) {
    const form = new FormData();
    form.set('chat_id', chatId);
    form.set('caption', previewText(action));
    form.set('parse_mode', 'HTML');
    form.set('reply_markup', JSON.stringify(keyboard));
    form.set('photo', new Blob([await readFile(action.image)], { type: 'image/jpeg' }), 'preview.jpg');
    message = await telegram('sendPhoto', form, true);
  } else {
    message = await telegram('sendMessage', { chat_id: chatId, text: previewText(action), parse_mode: 'HTML', reply_markup: keyboard });
  }

  const deadline = Date.now() + APPROVAL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const updates = await telegram('getUpdates', { offset: updateOffset, timeout: 50, allowed_updates: ['callback_query'] });
    for (const update of updates) {
      updateOffset = update.update_id + 1;
      const query = update.callback_query;
      if (!query?.data?.startsWith(`${id}|`) || String(query.message?.chat?.id) !== String(chatId)) continue;
      const approved = query.data.endsWith('|y');
      await telegram('answerCallbackQuery', { callback_query_id: query.id, text: approved ? 'Публикую' : 'Пропускаю' });
      await telegram('editMessageReplyMarkup', {
        chat_id: chatId,
        message_id: message.message_id,
        reply_markup: { inline_keyboard: [[{ text: approved ? '✅ Одобрено' : '❌ Пропущено', callback_data: 'done' }]] }
      });
      return approved;
    }
  }
  return false;
}

// One readline for the whole run: a fresh interface per question would drop answers already buffered from stdin.
let terminal;
const lines = [];
let waiting;
let closed = false;

async function askTerminal(action) {
  if (!terminal) {
    terminal = createInterface({ input: process.stdin });
    terminal.on('line', (line) => (waiting ? (waiting(line), (waiting = undefined)) : lines.push(line)));
    terminal.on('close', () => {
      closed = true;
      waiting?.('');
    });
  }
  console.log(`\n┌ ${action.label}${action.image ? `\n│ 🖼  ${action.image}` : ''}\n${(action.text ?? '').replace(/^/gm, '│ ')}`);
  process.stdout.write('└ Опубликовать? [y/N] ');
  // No more input (closed stdin) counts as "no".
  const answer = lines.length ? lines.shift() : closed ? '' : await new Promise((resolve) => (waiting = resolve));
  return /^(y|yes|д|да)$/i.test(answer.trim());
}

/**
 * Asks for approval of every action in order and runs the approved ones.
 * action: { label, text?, image?, run: async () => void }
 * Returns [{ label, status: 'done' | 'skipped' | 'failed', error? }].
 */
export async function runWithApproval(actions) {
  const useTelegram = Boolean(process.env.TELEGRAM_APPROVAL_CHAT_ID && process.env.TELEGRAM_BOT_TOKEN);
  const batch = Date.now().toString(36);
  const results = [];
  for (const [index, action] of actions.entries()) {
    const approved = useTelegram ? await askTelegram(action, `${batch}.${index}`) : await askTerminal(action);
    if (!approved) {
      console.log(`⏭  ${action.label} — пропущено`);
      results.push({ label: action.label, status: 'skipped' });
      continue;
    }
    try {
      await action.run();
      console.log(`✅ ${action.label}`);
      results.push({ label: action.label, status: 'done' });
    } catch (error) {
      console.error(`❌ ${action.label}: ${error.message}`);
      results.push({ label: action.label, status: 'failed', error: error.message });
    }
  }
  terminal?.close();
  terminal = undefined;
  closed = false;
  lines.length = 0;
  return results;
}
