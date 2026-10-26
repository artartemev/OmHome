// Inbox of @OmHome_Sch_bot: write an announcement to the bot (any text — strict format or free words), attach photos
// if you like, and it runs publish.mjs with it: posters → previews with ✅/❌ → only approved actions go out.
//
//   node --env-file=.env automation/bot.mjs
//
// Only messages from TELEGRAM_APPROVAL_CHAT_ID are read. Photos sent as an album with the text go to the events in
// order (first photo — first event). While one announcement is being approved the bot does not take new ones.
// PUBLISH_ARGS (default "--send --site --ai-photo": FLUX draws a photo when none is attached) — flags for publish.mjs.
// A file path as an argument is published first (e.g. to redo an announcement): node automation/bot.mjs ann.txt
//
// Once a week (WEEKLY_AT, default "mon 11:00", Chiang Mai time) and on /week the bot gathers the week's afisha into
// one message for Волшебный чат and @VeronikaKirpichenko (weekly.mjs) — previews come for ✅/❌ as usual.

import { execFileSync, spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHAT = String(process.env.TELEGRAM_APPROVAL_CHAT_ID ?? '');
const PUBLISH_ARGS = (process.env.PUBLISH_ARGS ?? '--send --site --ai-photo').split(/\s+/).filter(Boolean);
const WEEKLY_AT = (process.env.WEEKLY_AT ?? 'mon 11:00').toLowerCase();
const HELP = `Пришлите анонс одним сообщением — в строгом формате или свободным текстом, можно с фото (альбомом, подпись — анонс).
Я соберу афиши и пришлю каждое действие на ✅/❌. На ❌ можно ответить правкой текстом или новым фото.

/week — собрать подборку на неделю для Волшебного чата и Вероники («/week фитильки» — в центре другое событие) (сама собирается по расписанию: ${WEEKLY_AT}, время Чиангмая).`;

if (!process.env.TELEGRAM_BOT_TOKEN || !CHAT) {
  console.error('Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_APPROVAL_CHAT_ID');
  process.exit(1);
}

async function telegram(method, body) {
  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await response.json();
  if (!json.ok) throw new Error(`${method}: ${json.description}`);
  return json.result;
}

const say = (text) => telegram('sendMessage', { chat_id: CHAT, text }).catch((error) => console.error(error.message));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let offset = 0;
async function poll(timeout) {
  const updates = await telegram('getUpdates', { offset, timeout, allowed_updates: ['message', 'callback_query'] });
  for (const update of updates) offset = update.update_id + 1;
  return updates.map((update) => update.message).filter((message) => message && String(message.chat.id) === CHAT);
}

async function download(message, dir) {
  const fileId = message.photo?.at(-1)?.file_id ?? (/^image\//.test(message.document?.mime_type ?? '') ? message.document.file_id : null);
  if (!fileId) return null;
  const file = await telegram('getFile', { file_id: fileId });
  const response = await fetch(`https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`);
  const path = join(dir, `${message.message_id}-${file.file_path.split('/').pop()}`);
  await writeFile(path, Buffer.from(await response.arrayBuffer()));
  return path;
}

function runScript(args) {
  // On the server (BOT_SYNC_GIT=1) the clone is brought up to date with main first: fresh code and afisha.
  if (process.env.BOT_SYNC_GIT) {
    try {
      // Exactly main: whatever an earlier run left behind (an abandoned announcement in events.json, its posters)
      // must not reach the site with the next one.
      execFileSync('git', ['fetch', 'origin', 'main'], { cwd: ROOT, stdio: 'inherit' });
      execFileSync('git', ['reset', '--hard', 'origin/main'], { cwd: ROOT, stdio: 'inherit' });
      execFileSync('git', ['clean', '-fd', 'public/posters'], { cwd: ROOT, stdio: 'inherit' });
    } catch (error) {
      console.error(`⚠️ git pull: ${error.message}`);
    }
  }
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, { cwd: ROOT, stdio: 'inherit', env: process.env });
    child.on('exit', (code) => resolve(code));
  });
}

const publish = (file, photos) =>
  runScript(['automation/publish.mjs', file, ...photos.flatMap((photo) => ['--photo', photo]), ...PUBLISH_ARGS]);

// «/week фитильки» — the week's announcement told around that event (the kirtan by default).
async function weekly(feature = '') {
  const code = await runScript(['automation/weekly.mjs', ...(feature ? ['--feature', feature] : [])]);
  if (code !== 0) await say(`⚠️ Подборка на неделю упала (код ${code}) — подробности в логе.`);
}

// WEEKLY_AT «mon 11:00» in Chiang Mai time (UTC+7). Checked between polls; remembered per date, so it runs once a week.
const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
let weeklyDoneFor = null;
function weeklyDue() {
  const [day, time = '11:00'] = WEEKLY_AT.split(/\s+/);
  const [hour, minute] = time.split(':').map(Number);
  const local = new Date(Date.now() + 7 * 3_600_000);
  const today = local.toISOString().slice(0, 10);
  const due =
    WEEKDAYS[local.getUTCDay()] === day && local.getUTCHours() * 60 + local.getUTCMinutes() >= hour * 60 + (minute || 0);
  if (!due || weeklyDoneFor === today) return false;
  weeklyDoneFor = today;
  return true;
}

async function handle(messages) {
  const text = messages.map((message) => message.text ?? message.caption ?? '').filter(Boolean).join('\n\n').trim();
  if (/^\/(start|help)\b/.test(text)) return say(HELP);
  if (/^\/week\b/.test(text)) return weekly(text.replace(/^\/week\s*/, ''));
  if (!text) return say('Нужен текст анонса — пришлите его вместе с фото (подписью) или отдельным сообщением.');

  const dir = await mkdtemp(join(tmpdir(), 'omhome-inbox-'));
  const photos = [];
  for (const message of messages) {
    const photo = await download(message, dir);
    if (photo) photos.push(photo);
  }
  const file = join(dir, 'announcement.txt');
  await writeFile(file, text);
  await say(`🛠 Принял${photos.length ? ` (+${photos.length} фото)` : ''}. Собираю афиши — превью придут сюда на ✅/❌.`);
  const code = await publish(file, photos);
  await say(code === 0 ? '🏁 Готово. Жду следующий анонс.' : `⚠️ Публикация упала (код ${code}) — подробности в логе. Жду следующий анонс.`);
}

for (const file of process.argv.slice(2)) {
  await say('🛠 Собираю афиши — превью придут сюда на ✅/❌.');
  const code = await publish(resolve(file), []);
  await say(code === 0 ? '🏁 Готово. Жду следующий анонс.' : `⚠️ Публикация упала (код ${code}). Жду следующий анонс.`);
}

console.log('📬 Бот слушает анонсы…');
for (;;) {
  try {
    if (weeklyDue()) await weekly();
    const messages = await poll(50);
    if (!messages.length) continue;
    // An album arrives as several messages in a row: give the rest of it a moment to come.
    if (messages.some((message) => message.media_group_id)) messages.push(...(await poll(3)));
    await handle(messages);
  } catch (error) {
    console.error(`⚠️ ${error.message}`);
    await sleep(5000);
  }
}
