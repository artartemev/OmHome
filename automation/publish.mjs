// One command from a schedule message to posters, the website afisha and posts everywhere.
//
//   node automation/publish.mjs schedule.txt --photo kirtan=./kirtan.jpg --photo шляпа=./hat.jpg [--palette brown] [--send]
//   node automation/publish.mjs schedule.txt --ai-text expand --ai-photo     # Gemini пишет текст, FLUX рисует фото
//   node automation/publish.mjs schedule.txt --poster "Мантра-йога=./ready.jpg"  # готовая афиша — как есть
//   node automation/publish.mjs free-text.txt                                   # свободный текст — Gemini разберёт
//   node automation/publish.mjs free-text.txt --photo a.jpg --photo b.jpg       # фото без подписи — по порядку событий
//
// One event = one post. A photo you attach (--photo) goes into the branded arch frame as is — nothing is searched
// or generated for that event. Without a photo, recurring events (kirtan) rotate through automation/photos/<type>/;
// --ai-photo only fills what is still missing.
// --site adds one more approval: commit + push public/events.json and posters so omhome.space updates.
// --only telegram,chats,partners,site,instagram limits the run to those kinds of actions.
// Poster colour is fixed per event type (kirtan — teal, cinema — ocean, games — navy, …); --palette overrides it.
// Without --send it is a dry run: posters are rendered, public/events.json is updated and the posts are printed.
//
// With --send NOTHING goes out without your approval: every action — channel post, each chat repost, the message to
// partners, Instagram post, Instagram story — is shown to you first (in Telegram with ✅/❌ buttons when
// TELEGRAM_APPROVAL_CHAT_ID is set, otherwise in the terminal) and runs only after ✅. See approval.mjs.
// ❌ on an event's post opens «Что поправить?»: reply with text and/or a photo — Gemini applies the edit, the poster,
// caption and site entry are rebuilt and the preview comes again; «🗑 Отменить анонс» drops the event everywhere.
//
// Env (only needed for --send):
//   TELEGRAM_BOT_TOKEN        token of the OmHome bot (admin in the channel)
//   TELEGRAM_CHANNEL_ID       @omhome_thai
//   TELEGRAM_APPROVAL_CHAT_ID your chat with the bot, where previews with ✅/❌ arrive
//   TELEGRAM_REPOST_CHAT_IDS  chats where the bot is a member, "id=Name,id=Name" (e.g. -1001234=Волшебный чат)
//   TG_API_ID, TG_API_HASH, TG_SESSION  your Telethon session: partners (@VeronikaKirpichenko) get posters from your account
//   TG_USER_REPOST_CHATS      chats the bot can't join, posted from your account: "invite-link=Name,…" (Волшебный чат)
//   IG_ACCESS_TOKEN (IG_USER_ID optional) Instagram post + story (see instagram.mjs)
//   GEMINI_API_KEY, CLOUDFLARE_*        for --ai-text / --ai-photo

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import {
  CATEGORY_PALETTE,
  formatPost,
  guessCategory,
  parseSchedule,
  todayIso,
  toScheduleBlock,
  toSiteEvent
} from './announcement.mjs';
import { notify, requestPhoto, runWithApproval } from './approval.mjs';
import { editAnnouncement, generatePhoto, matchPhotos, rewriteDescription, structureAnnouncement } from './gemini.mjs';
import { instagramConfigured, publishPost, publishStory, toInstagramCaption } from './instagram.mjs';
import { markPoolPhotoUsed, pickPoolPhoto } from './photo_pool.mjs';
import { renderPoster, storyFromPoster } from './poster/render.mjs';

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

// Outward actions for one event, each approved separately. Fields are read from the state at approval time, so
// after an edit the preview and the post show the new version. Edits are offered until something of the event is out.
function eventActions(state) {
  const channel = process.env.TELEGRAM_CHANNEL_ID;
  const title = () => state.event.title;
  const editable = (action) =>
    Object.defineProperty(action, 'onEdit', { get: () => (state.published ? undefined : (edit) => editState(state, edit)) });
  const actions = [
    editable({
      kind: 'telegram',
      group: state,
      label: () => `📣 Пост в канал ${channel} — ${title()}`,
      image: () => state.posterPath,
      text: () => state.caption,
      run: async () => {
        state.channelMessage = await sendPhoto(channel, state.posterPath, state.caption);
        state.published = true;
      }
    }),
    ...repostChats().map((chat) =>
      editable({
        kind: 'telegram',
        group: state,
        label: () => `🔁 Репост в «${chat.name}» — ${title()}`,
        image: () => state.posterPath,
        text: () => state.caption,
        run: async () => {
          // Forward keeps the link to the channel; if the channel post was skipped, send the poster itself.
          if (state.channelMessage) {
            await telegram('forwardMessage', { chat_id: chat.id, from_chat_id: channel, message_id: state.channelMessage.message_id });
          } else {
            await sendPhoto(chat.id, state.posterPath, state.caption);
          }
          state.published = true;
        }
      })
    )
  ];
  if (process.env.TG_SESSION) {
    for (const chat of userChats()) {
      actions.push(
        editable({
          kind: 'chats',
          group: state,
          label: () => `🔁 Репост в «${chat.name}» с вашего аккаунта — ${title()}`,
          image: () => state.posterPath,
          text: () => state.caption,
          run: async () => {
            execFileSync('python3', [PARTNER_SCRIPT, '--chats', state.posterPath, state.captionFile], {
              stdio: 'inherit',
              env: { ...process.env, TG_USER_REPOST_CHATS: `${chat.link}=${chat.name}` }
            });
            state.published = true;
          }
        })
      );
    }
  }
  return actions;
}

// Instagram downloads the poster from omhome.space, so these run after the site update (and are not editable:
// the site already has this version of the poster).
function instagramActions(state) {
  if (!instagramConfigured()) return [];
  const caption = () => {
    const tags = (state.event.instagram ?? []).map((handle) => `@${handle}`).join(' ');
    return toInstagramCaption(state.caption, `${tags ? `\n\n${tags}` : ''}\n\nАдрес и запись — в шапке профиля и в Telegram: t.me/omhome_thai`);
  };
  const story = () => state.posterPath.replace(/\.jpg$/, '-story.jpg');
  return [
    {
      kind: 'instagram',
      group: state,
      label: () => `📸 Пост в Instagram — ${state.event.title}`,
      image: () => state.posterPath,
      text: caption,
      run: () => publishPost(state.posterPath, caption())
    },
    {
      kind: 'instagram',
      group: state,
      label: () => `📱 Сториз в Instagram — ${state.event.title}`,
      image: story,
      run: () => publishStory(story())
    }
  ];
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    photo: { type: 'string', multiple: true, default: [] },
    poster: { type: 'string', multiple: true, default: [] },
    site: { type: 'boolean', default: false },
    only: { type: 'string' },
    'ai-parse': { type: 'boolean', default: false },
    'photo-match': { type: 'string', default: 'order' },
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
    entries.filter((entry) => entry.includes('=')).map((entry) => {
      const [title, ...path] = entry.split('=');
      return [title.trim().toLowerCase(), path.join('=')];
    })
  );
const photos = byTitle(values.photo);
const readyPosters = byTitle(values.poster);
const workDir = await mkdtemp(join(tmpdir(), 'omhome-'));
const states = [];
// Free text works too: if the message is not in the strict format (or --ai-parse), Gemini turns it into that format
// first, and the result is printed so you can see exactly how it was understood.
const message = await readFile(positionals[0], 'utf8');
let events = values['ai-parse'] ? [] : parseSchedule(message);
if (!events.length) {
  let structured;
  try {
    structured = await structureAnnouncement(message, todayIso());
  } catch (error) {
    await notify(`⚠️ Не смог разобрать свободный текст — ${error.message}. Пришлите анонс в формате «дата время / название / описание».`);
    process.exit(1);
  }
  await notify(`🧠 Разобрал анонс так:\n\n${structured}`);
  events = parseSchedule(structured);
}
const defaults = JSON.parse(await readFile(resolve('automation/defaults.json'), 'utf8'));

// Photos attached without a title (--photo ./a.jpg ./b.jpg) go to the events in the same order as in the text:
// the first photo to the first event, and so on. Events here look alike, so guessing by the picture is unreliable;
// --photo-match ai lets Gemini choose instead (leftovers still go in order). The posters are approved anyway.
const loosePhotos = values.photo.filter((entry) => !entry.includes('='));
if (loosePhotos.length) {
  let match = events.map(() => -1);
  if (values['photo-match'] === 'ai') {
    try {
      match = await matchPhotos(events, loosePhotos);
    } catch (error) {
      console.warn(`⚠️  Gemini не подобрал фото, раскладываю по порядку — ${error.message}`);
    }
  }
  const used = new Set(match.filter((index) => index >= 0));
  const spare = loosePhotos.map((_, index) => index).filter((index) => !used.has(index));
  events.forEach((event, index) => {
    if (match[index] < 0 && spare.length) match[index] = spare.shift();
    if (match[index] >= 0 && !photos[event.title.toLowerCase()]) photos[event.title.toLowerCase()] = loosePhotos[match[index]];
  });
  console.log('📎 Фото по событиям:');
  for (const event of events) console.log(`   ${event.title} ← ${photos[event.title.toLowerCase()]?.split('/').pop() ?? 'без фото'}`);
}
const site = JSON.parse(await readFile(EVENTS_FILE, 'utf8'));

async function saveSite() {
  site.events.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  site.updatedAt = new Date().toISOString().slice(0, 10);
  await writeFile(EVENTS_FILE, `${JSON.stringify(site, null, 2)}\n`);
}

const tracked = (path) => {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', path], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// Removes an event from the afisha; its posters too, unless they are already on the site from an earlier run.
async function dropEvent(id) {
  site.events = site.events.filter((existing) => existing.id !== id);
  for (const path of [`${POSTERS_DIR}/${id}.jpg`, `${POSTERS_DIR}/${id}-story.jpg`]) {
    if (existsSync(path) && !tracked(path)) await rm(path);
  }
}

// Poster (post + story), channel caption and site entry from the current state of the event.
async function build(state) {
  const { event } = state;
  state.posterPath = undefined;
  if (state.readyPoster) {
    state.posterPath = `${POSTERS_DIR}/${event.id}.jpg`;
    if (resolve(state.readyPoster) !== resolve(state.posterPath)) await copyFile(state.readyPoster, state.posterPath);
    const storyPath = state.posterPath.replace(/\.jpg$/, '-story.jpg');
    if (!existsSync(storyPath) || state.rebuilt) await storyFromPoster(state.posterPath, storyPath);
  } else if (state.photo) {
    const out = `${POSTERS_DIR}/${event.id}`;
    await renderPoster({ ...event, photo: state.photo, palette: values.palette ?? CATEGORY_PALETTE[event.category], out });
    state.posterPath = `${out}.jpg`;
  } else {
    console.warn(`⚠️  ${event.title}: нет фото (--photo "${event.title}=path" или --ai-photo), афиша не собрана`);
  }
  state.caption = formatPost(event);
  if (!state.posterPath) {
    site.events = site.events.filter((existing) => existing.id !== event.id);
    return;
  }
  state.captionFile = join(workDir, `${event.id}.html`);
  await writeFile(state.captionFile, state.caption);
  const siteEvent = toSiteEvent(event, state.posterPath ? `/${state.posterPath.replace(/^public\//, '')}` : undefined);
  site.events = [...site.events.filter((existing) => existing.id !== event.id), siteEvent];
}

// An edit from the approval dialogue: text goes to Gemini together with the announcement, a photo replaces the one in
// the arch frame. Everything is rebuilt; the preview is then asked again.
async function editState(state, { text, photo }) {
  const oldId = state.event.id;
  if (text) {
    const answer = await editAnnouncement(toScheduleBlock(state.event), text, todayIso());
    const [edited] = parseSchedule(answer);
    if (!edited) throw new Error(`Gemini вернул анонс, который не читается:\n${answer}`);
    for (const warning of edited.warnings) console.warn(`⚠️  ${edited.title}: ${warning}`);
    edited.category = guessCategory(edited);
    state.event = edited;
  }
  if (photo) {
    state.photo = photo;
    state.readyPoster = undefined;
  }
  if (state.event.id !== oldId) await dropEvent(oldId);
  state.rebuilt = true;
  await build(state);
  await saveSite();
  console.log(`\n──── ${state.event.title} (после правки) ────\n${state.caption}`);
}

const live = () => states.filter((state) => !state.cancelled && state.posterPath);

for (const event of events) {
  for (const warning of event.warnings) console.warn(`⚠️  ${event.title}: ${warning}`);
  event.category = guessCategory(event);
  // "As usual" events get the standard text, retold by Gemini each time so the posts don't repeat word for word.
  if (!event.description && defaults.descriptions[event.category]) {
    event.description = defaults.descriptions[event.category];
    try {
      event.description = await rewriteDescription(event, 'vary');
      console.log(`✍️  ${event.title}: стандартное описание пересказано заново`);
    } catch (error) {
      console.warn(`⚠️  ${event.title}: стандартное описание без пересказа — ${error.message}`);
    }
  }

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
    await notify(`🎨 ${event.title}: фото не приложено — рисую (FLUX), это ~полминуты…`);
    try {
      photo = await generatePhoto(event, join(workDir, `${event.id}.png`));
      console.log(`🎨 ${event.title}: фото сгенерировано`);
    } catch (error) {
      await notify(`⚠️ ${event.title}: фото не получилось нарисовать — ${error.message}`);
      // Nothing drawn: you get the prompt, draw the picture yourself and send it back.
      if (error.prompt && values.send) {
        photo = await requestPhoto(
          `🎨 ${event.title}: нарисуйте фото сами (Gemini, Midjourney…) по этому промпту и пришлите его сюда — поставлю в афишу.\n\n${error.prompt}`
        );
      }
    }
  }

  const state = { event, photo, readyPoster };
  await build(state);
  if (photo && !readyPoster) await markPoolPhotoUsed(resolve(photo), event.date);
  states.push(state);
  if (!state.posterPath) {
    await notify(`⚠️ ${event.title}: афиша не собрана — нет фото. Пришлите анонс ещё раз вместе с фото.`);
  }

  console.log(`\n──── ${event.title} ────\n${state.caption}`);
  if (state.posterPath) console.log(`🖼  ${state.posterPath}`);
}
await saveSite();

const actions = [];
if (values.send) {
  const ready = states.filter((state) => state.posterPath);
  for (const state of ready) actions.push(...eventActions(state));

  if (ready.length && process.env.TG_SESSION) {
    // The greeting is picked now so the preview shows exactly what will be sent.
    const intro = execFileSync('python3', [PARTNER_SCRIPT, '--pick-intro']).toString().trim();
    const partners = (process.env.TG_PARTNERS ?? 'VeronikaKirpichenko').split(',').map((p) => `@${p.trim().replace(/^@/, '')}`);
    actions.push({
      kind: 'partners',
      label: `💌 Личное сообщение ${partners.join(', ')} с вашего аккаунта`,
      image: () => live()[0]?.posterPath,
      text: () => `${intro}\n\n+ ${live().length} афиш(и): ${live().map((state) => state.event.title).join(', ')}`,
      skip: () => !live().length,
      run: async () => {
        execFileSync('python3', [PARTNER_SCRIPT, ...live().flatMap((state) => [state.posterPath, state.captionFile])], {
          stdio: 'inherit',
          env: { ...process.env, TG_PARTNER_INTRO: intro }
        });
        for (const state of live()) state.published = true;
      }
    });
  }

  if (values.site && ready.length) {
    const titles = () => live().map((state) => state.event.title).join(', ');
    actions.push({
      kind: 'site',
      label: () => `🌐 Афиша на omhome.space: ${titles()}`,
      image: () => live()[0]?.posterPath,
      text: 'Коммит public/events.json и афиш в main — Vercel пересоберёт сайт за пару минут.',
      skip: () => !live().length,
      run: async () => {
        const git = (...args) => execFileSync('git', args, { stdio: 'inherit' });
        git('add', 'public/events.json', POSTERS_DIR, 'automation/photos/history.json');
        git('commit', '-m', `Афиша: ${titles()}`);
        git('push', 'origin', 'HEAD:main');
        for (const state of live()) state.published = true;
      }
    });
  }

  for (const state of ready) actions.push(...instagramActions(state));
}

// --only instagram,site — ask only about these kinds (e.g. Instagram for an event already posted to Telegram).
const onlyKinds = values.only?.split(',').map((kind) => kind.trim());
const selected = onlyKinds ? actions.filter((action) => onlyKinds.includes(action.kind)) : actions;

if (selected.length) {
  const results = await runWithApproval(selected, {
    // «🗑 Отменить анонс»: the event leaves the afisha (unless it is already published somewhere).
    onCancel: async (state) => {
      state.cancelled = true;
      if (!state.published) {
        await dropEvent(state.event.id);
        await saveSite();
      }
    }
  });
  const count = (status) => results.filter((result) => result.status === status).length;
  console.log(
    `\nИтого: выполнено ${count('done')}, пропущено ${count('skipped')}, отменено ${count('cancelled')}, с ошибкой ${count('failed')}`
  );
}

console.log(`\n📅 ${EVENTS_FILE} обновлён: в афише ${live().length} из ${states.length} событ.`);
