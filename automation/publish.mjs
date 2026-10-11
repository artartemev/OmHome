// One command from a schedule message to posters, the website afisha and Telegram posts.
//
//   node automation/publish.mjs schedule.txt --photo kirtan=./kirtan.jpg --photo шляпа=./hat.jpg [--palette brown] [--send]
//   node automation/publish.mjs schedule.txt --ai-text expand --ai-photo     # Gemini пишет текст и рисует фото
//
// Poster colour is fixed per event type (kirtan — teal, cinema — ocean, games — navy, …); --palette overrides it.
// Without --send it is a dry run: posters are rendered, public/events.json is updated and the posts are printed.
// With --send the poster + caption goes to the channel and is forwarded to every chat in TELEGRAM_REPOST_CHAT_IDS.
//
// Env (only needed for --send):
//   TELEGRAM_BOT_TOKEN       token of the OmHome bot (admin in the channel)
//   TELEGRAM_CHANNEL_ID      @omhome_thai
//   TELEGRAM_REPOST_CHAT_IDS comma-separated chat ids where the bot is a member (repost chat)
//   TG_API_ID, TG_API_HASH, TG_SESSION  your Telethon session: partners (@VeronikaKirpichenko) get the poster from your account
//   GEMINI_API_KEY           for --ai-text / --ai-photo

import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { CATEGORY_PALETTE, formatPost, guessCategory, parseSchedule, toSiteEvent } from './announcement.mjs';
import { generatePhoto, rewriteDescription } from './gemini.mjs';
import { renderPoster } from './poster/render.mjs';

const EVENTS_FILE = resolve('public/events.json');
const POSTERS_DIR = 'public/posters';

async function telegram(method, payload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, payload);
  const json = await response.json();
  if (!json.ok) throw new Error(`${method}: ${json.description}`);
  return json.result;
}

async function sendToChannel(posterPath, caption) {
  const form = new FormData();
  form.set('chat_id', process.env.TELEGRAM_CHANNEL_ID);
  form.set('caption', caption);
  form.set('parse_mode', 'HTML');
  form.set('photo', new Blob([await readFile(posterPath)], { type: 'image/jpeg' }), 'poster.jpg');
  const message = await telegram('sendPhoto', { method: 'POST', body: form });

  const repostTargets = (process.env.TELEGRAM_REPOST_CHAT_IDS ?? '').split(',').map((id) => id.trim()).filter(Boolean);
  for (const chatId of repostTargets) {
    await telegram('forwardMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, from_chat_id: process.env.TELEGRAM_CHANNEL_ID, message_id: message.message_id })
    });
  }
  return message;
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    photo: { type: 'string', multiple: true, default: [] },
    palette: { type: 'string' },
    'ai-text': { type: 'string' },
    'ai-photo': { type: 'boolean', default: false },
    send: { type: 'boolean', default: false }
  }
});

if (!positionals[0]) {
  console.error('Usage: node automation/publish.mjs schedule.txt --photo <title>=<path> [--palette teal] [--send]');
  process.exit(1);
}

if (values.send) {
  for (const key of ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHANNEL_ID']) {
    if (!process.env[key]) {
      console.error(`${key} is not set`);
      process.exit(1);
    }
  }
}

const photos = Object.fromEntries(
  values.photo.map((entry) => {
    const [title, ...path] = entry.split('=');
    return [title.trim().toLowerCase(), path.join('=')];
  })
);
const workDir = await mkdtemp(join(tmpdir(), 'omhome-'));
const partnerPosts = []; // poster, caption, poster, caption… — sent to partners in one go after the channel
const events = parseSchedule(await readFile(positionals[0], 'utf8'));
const site = JSON.parse(await readFile(EVENTS_FILE, 'utf8'));

for (const event of events) {
  for (const warning of event.warnings) console.warn(`⚠️  ${event.title}: ${warning}`);
  event.category = guessCategory(event);

  if (values['ai-text']) {
    try {
      event.description = await rewriteDescription(event, values['ai-text']);
    } catch (error) {
      console.warn(`⚠️  ${event.title}: текст оставлен как есть — ${error.message}`);
    }
  }

  let photo = photos[event.title.toLowerCase()] ?? photos['*'];
  if (!photo && values['ai-photo']) {
    try {
      photo = await generatePhoto(event, join(workDir, `${event.id}.png`));
      console.log(`🎨 ${event.title}: фото сгенерировано`);
    } catch (error) {
      console.warn(`⚠️  ${event.title}: фото не сгенерировано — ${error.message}`);
    }
  }

  let posterPath;
  if (photo) {
    const out = `${POSTERS_DIR}/${event.id}`;
    const palette = values.palette ?? CATEGORY_PALETTE[event.category];
    await renderPoster({ ...event, photo, palette, out });
    posterPath = `${out}.jpg`;
  } else {
    console.warn(`⚠️  ${event.title}: нет фото (--photo "${event.title}=path" или --ai-photo), афиша не собрана`);
  }

  const siteEvent = toSiteEvent(event, posterPath ? `/${posterPath.replace(/^public\//, '')}` : undefined);
  site.events = [...site.events.filter((existing) => existing.id !== event.id), siteEvent];

  const caption = formatPost(event);
  console.log(`\n──── ${event.title} ────\n${caption}`);
  if (posterPath) console.log(`🖼  ${posterPath}`);

  if (values.send && posterPath) {
    await sendToChannel(posterPath, caption);
    console.log('✅ опубликовано в канал и разослано по чатам');
    const captionFile = join(workDir, `${event.id}.html`);
    await writeFile(captionFile, caption);
    partnerPosts.push(posterPath, captionFile);
  }
}

if (partnerPosts.length && process.env.TG_SESSION) {
  execFileSync('python3', [resolve('automation/telegram_user.py'), ...partnerPosts], { stdio: 'inherit' });
}

site.events.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
site.updatedAt = new Date().toISOString().slice(0, 10);
await writeFile(EVENTS_FILE, `${JSON.stringify(site, null, 2)}\n`);
console.log(`\n📅 ${EVENTS_FILE} обновлён: ${events.length} событ.`);
