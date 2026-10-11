// One command from a schedule message to posters, the website afisha and posts everywhere.
//
//   node automation/publish.mjs schedule.txt --photo kirtan=./kirtan.jpg --photo шляпа=./hat.jpg [--palette brown] [--send]
//   node automation/publish.mjs schedule.txt --ai-text expand --ai-photo     # Gemini пишет текст, FLUX рисует фото
//   node automation/publish.mjs schedule.txt --poster "Мантра-йога=./ready.jpg"  # готовая афиша — как есть
//
// One event = one post. A photo you attach (--photo) goes into the branded arch frame as is — nothing is searched
// or generated for that event. Without a photo, recurring events (kirtan) rotate through automation/photos/<type>/;
// --ai-photo only fills what is still missing.
// --site adds one more approval: commit + push public/events.json and posters so omhome.space updates.
// Poster colour is fixed per event type (kirtan — teal, cinema — ocean, games — navy, …); --palette overrides it.
// Without --send it is a dry run: posters are rendered, public/events.json is updated and the posts are printed.
//
// With --send NOTHING goes out without your approval: every action — channel post, each chat repost, the message to
// partners, Instagram post, Instagram story — is shown to you first (in Telegram with ✅/❌ buttons when
// TELEGRAM_APPROVAL_CHAT_ID is set, otherwise in the terminal) and runs only after ✅. See approval.mjs.
//
// Env (only needed for --send):
//   TELEGRAM_BOT_TOKEN        token of the OmHome bot (admin in the channel)
//   TELEGRAM_CHANNEL_ID       @omhome_thai
//   TELEGRAM_APPROVAL_CHAT_ID your chat with the bot, where previews with ✅/❌ arrive
//   TELEGRAM_REPOST_CHAT_IDS  chats where the bot is a member, "id=Name,id=Name" (e.g. -1001234=Волшебный чат)
//   TG_API_ID, TG_API_HASH, TG_SESSION  your Telethon session: partners (@VeronikaKirpichenko) get posters from your account
//   TG_USER_REPOST_CHATS      chats the bot can't join, posted from your account: "invite-link=Name,…" (Волшебный чат)
//   IG_USER_ID, IG_ACCESS_TOKEN         Instagram post + story (see instagram.mjs)
//   GEMINI_API_KEY, CLOUDFLARE_*        for --ai-text / --ai-photo

import { execFileSync } from 'node:child_process';
import { copyFile, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { CATEGORY_PALETTE, formatPost, guessCategory, parseSchedule, toSiteEvent } from './announcement.mjs';
import { runWithApproval } from './approval.mjs';
import { generatePhoto, rewriteDescription } from './gemini.mjs';
import { instagramConfigured, publishPost, publishStory, toInstagramCaption } from './instagram.mjs';
import { markPoolPhotoUsed, pickPoolPhoto } from './photo_pool.mjs';
import { renderPoster } from './poster/render.mjs';

const EVENTS_FILE = resolve('public/events.json');
const POSTERS_DIR = 'public/posters';
const PARTNER_SCRIPT = resolve('automation/telegram_user.py');

async function telegram(method, body, isForm = false) {
  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    ...(isForm ? { body } : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  });
  const json = await response.json();
  if (!json.ok) throw new Error(`${method}: ${json.description}`);
  return json.result;
}

async function sendPhoto(chatId, posterPath, caption) {
  const form = new FormData();
  form.set('chat_id', chatId);
  form.set('caption', caption);
  form.set('parse_mode', 'HTML');
  form.set('photo', new Blob([await readFile(posterPath)], { type: 'image/jpeg' }), 'poster.jpg');
  return telegram('sendPhoto', form, true);
}

const repostChats = () =>
  (process.env.TELEGRAM_REPOST_CHAT_IDS ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [id, ...name] = entry.split('=');
      return { id: id.trim(), name: name.join('=').trim() || id.trim() };
    });

const userChats = () =>
  (process.env.TG_USER_REPOST_CHATS ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [link, ...name] = entry.split('=');
      return { link: link.trim(), name: name.join('=').trim() || link.trim() };
    });

// Outward actions for one event, each approved separately.
function eventActions(event, posterPath, caption, captionFile) {
  const channel = process.env.TELEGRAM_CHANNEL_ID;
  let channelMessage;
  const actions = [
    {
      label: `📣 Пост в канал ${channel} — ${event.title}`,
      image: posterPath,
      text: caption,
      run: async () => {
        channelMessage = await sendPhoto(channel, posterPath, caption);
      }
    },
    ...repostChats().map((chat) => ({
      label: `🔁 Репост в «${chat.name}» — ${event.title}`,
      image: posterPath,
      text: caption,
      run: async () => {
        // Forward keeps the link to the channel; if the channel post was skipped, send the poster itself.
        if (channelMessage) {
          await telegram('forwardMessage', { chat_id: chat.id, from_chat_id: channel, message_id: channelMessage.message_id });
        } else {
          await sendPhoto(chat.id, posterPath, caption);
        }
      }
    }))
  ];
  if (process.env.TG_SESSION) {
    for (const chat of userChats()) {
      actions.push({
        label: `🔁 Репост в «${chat.name}» с вашего аккаунта — ${event.title}`,
        image: posterPath,
        text: caption,
        run: async () => {
          execFileSync('python3', [PARTNER_SCRIPT, '--chats', posterPath, captionFile], {
            stdio: 'inherit',
            env: { ...process.env, TG_USER_REPOST_CHATS: `${chat.link}=${chat.name}` }
          });
        }
      });
    }
  }
  if (instagramConfigured()) {
    const tags = (event.instagram ?? []).map((handle) => `@${handle}`).join(' ');
    const igCaption = toInstagramCaption(
      caption,
      `${tags ? `\n\n${tags}` : ''}\n\nАдрес и запись — в шапке профиля и в Telegram: t.me/omhome_thai`
    );
    actions.push(
      { label: `📸 Пост в Instagram — ${event.title}`, image: posterPath, text: igCaption, run: () => publishPost(posterPath, igCaption) },
      {
        label: `📱 Сториз в Instagram — ${event.title}`,
        image: posterPath.replace(/\.jpg$/, '-story.jpg'),
        run: () => publishStory(posterPath.replace(/\.jpg$/, '-story.jpg'))
      }
    );
  }
  return actions;
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    photo: { type: 'string', multiple: true, default: [] },
    poster: { type: 'string', multiple: true, default: [] },
    site: { type: 'boolean', default: false },
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
  if (!process.env.TELEGRAM_APPROVAL_CHAT_ID && !process.stdin.isTTY) {
    console.error('Нет TELEGRAM_APPROVAL_CHAT_ID и нет терминала для подтверждения — без одобрения ничего не отправляется.');
    process.exit(1);
  }
  for (const key of ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHANNEL_ID']) {
    if (!process.env[key]) {
      console.error(`${key} is not set`);
      process.exit(1);
    }
  }
}

const byTitle = (entries) =>
  Object.fromEntries(
    entries.map((entry) => {
      const [title, ...path] = entry.split('=');
      return [title.trim().toLowerCase(), path.join('=')];
    })
  );
const photos = byTitle(values.photo);
const readyPosters = byTitle(values.poster);
const workDir = await mkdtemp(join(tmpdir(), 'omhome-'));
const partnerPosts = []; // poster, caption, poster, caption… — sent to partners in one go after the channel
const actions = [];
const titles = [];
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

  const readyPoster = readyPosters[event.title.toLowerCase()];
  let photo = readyPoster ? undefined : photos[event.title.toLowerCase()] ?? photos['*'];
  // Recurring events (kirtan) without an attached photo take the next one from automation/photos/<category>/.
  if (!readyPoster && !photo) {
    photo = await pickPoolPhoto(event.category);
    if (photo) console.log(`🖼  ${event.title}: фото из ротации — ${photo.split('/').pop()}`);
  }
  if (!readyPoster && !photo && values['ai-photo']) {
    try {
      photo = await generatePhoto(event, join(workDir, `${event.id}.png`));
      console.log(`🎨 ${event.title}: фото сгенерировано`);
    } catch (error) {
      console.warn(`⚠️  ${event.title}: фото не сгенерировано — ${error.message}`);
    }
  }

  let posterPath;
  if (readyPoster) {
    posterPath = `${POSTERS_DIR}/${event.id}.jpg`;
    if (resolve(readyPoster) !== resolve(posterPath)) await copyFile(readyPoster, posterPath);
  } else if (photo) {
    const out = `${POSTERS_DIR}/${event.id}`;
    const palette = values.palette ?? CATEGORY_PALETTE[event.category];
    await renderPoster({ ...event, photo, palette, out });
    posterPath = `${out}.jpg`;
    await markPoolPhotoUsed(resolve(photo), event.date);
  } else {
    console.warn(`⚠️  ${event.title}: нет фото (--photo "${event.title}=path" или --ai-photo), афиша не собрана`);
  }

  const siteEvent = toSiteEvent(event, posterPath ? `/${posterPath.replace(/^public\//, '')}` : undefined);
  site.events = [...site.events.filter((existing) => existing.id !== event.id), siteEvent];

  const caption = formatPost(event);
  console.log(`\n──── ${event.title} ────\n${caption}`);
  if (posterPath) console.log(`🖼  ${posterPath}`);

  if (values.send && posterPath) {
    const captionFile = join(workDir, `${event.id}.html`);
    await writeFile(captionFile, caption);
    actions.push(...eventActions(event, posterPath, caption, captionFile));
    partnerPosts.push(posterPath, captionFile);
    titles.push(event.title);
  }
}

if (partnerPosts.length && process.env.TG_SESSION) {
  // The greeting is picked now so the preview shows exactly what will be sent.
  const intro = execFileSync('python3', [PARTNER_SCRIPT, '--pick-intro']).toString().trim();
  const partners = (process.env.TG_PARTNERS ?? 'VeronikaKirpichenko').split(',').map((p) => `@${p.trim().replace(/^@/, '')}`);
  actions.push({
    label: `💌 Личное сообщение ${partners.join(', ')} с вашего аккаунта`,
    image: partnerPosts[0],
    text: `${intro}\n\n+ ${titles.length} афиш(и): ${titles.join(', ')}`,
    run: async () => {
      execFileSync('python3', [PARTNER_SCRIPT, ...partnerPosts], {
        stdio: 'inherit',
        env: { ...process.env, TG_PARTNER_INTRO: intro }
      });
    }
  });
}

site.events.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
site.updatedAt = new Date().toISOString().slice(0, 10);
await writeFile(EVENTS_FILE, `${JSON.stringify(site, null, 2)}\n`);

if (values.send && values.site && titles.length) {
  actions.push({
    label: `🌐 Афиша на omhome.space: ${titles.join(', ')}`,
    image: partnerPosts[0],
    text: 'Коммит public/events.json и афиш в main — Vercel пересоберёт сайт за пару минут.',
    run: async () => {
      const git = (...args) => execFileSync('git', args, { stdio: 'inherit' });
      git('add', 'public/events.json', POSTERS_DIR, 'automation/photos/history.json');
      git('commit', '-m', `Афиша: ${titles.join(', ')}`);
      git('push', 'origin', 'HEAD:main');
    }
  });
}

if (actions.length) {
  const results = await runWithApproval(actions);
  const count = (status) => results.filter((result) => result.status === status).length;
  console.log(`\nИтого: выполнено ${count('done')}, пропущено ${count('skipped')}, с ошибкой ${count('failed')}`);
}

console.log(`\n📅 ${EVENTS_FILE} обновлён: ${events.length} событ.`);
