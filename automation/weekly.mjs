// The week's announcement for friendly chats (Волшебный чат) and partners (@VeronikaKirpichenko): ONE message.
//
//   node automation/weekly.mjs              # events of the next 7 days from public/events.json
//   node automation/weekly.mjs --days 10    # a longer window
//
// Announcements come one by one through the week; this runs once a week (the bot starts it on schedule or on /week).
// One event is told properly — the Saturday kirtan (WEEKLY_FEATURE, a regexp) — in a warm text Gemini writes in your
// voice, with its poster; the rest of the week is listed below, each with a link to its post in the channel. The same
// text goes to every chat and partner (a partner first gets a greeting). The kirtan is added even without its own
// announcement. Previewed with ✅/❌ like everything else; on ❌ reply with an edit («короче», «больше про киртан») or
// «заново» for a fresh text.
//
// Sent from your account (Telethon: TG_SESSION / TG_SESSION_STRING). Without a session the bot sends you the ready
// poster and text, and you forward them yourself.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { daysText, digestFooter, digestHtml, digestPlain, shortDate, todayIso } from './announcement.mjs';
import { notify, runWithApproval } from './approval.mjs';
import { editDigest, writeWeekIntro } from './gemini.mjs';

const PARTNER_SCRIPT = resolve('automation/telegram_user.py');
const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const userSession = Boolean(process.env.TG_SESSION || process.env.TG_SESSION_STRING);

const { values } = parseArgs({ options: { days: { type: 'string', default: '7' } } });

const addDays = (iso, days) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
const weekday = (iso) => WEEKDAYS[new Date(`${iso}T00:00:00Z`).getUTCDay()];
const posterFile = (poster) => (poster ? resolve('public', poster.replace(/^\//, '')) : null);

// Events of the window: everything on the afisha, plus the Saturday kirtan where it has no announcement of its own.
async function weekEvents() {
  const site = JSON.parse(await readFile(resolve('public/events.json'), 'utf8'));
  const defaults = JSON.parse(await readFile(resolve('automation/defaults.json'), 'utf8'));
  const from = todayIso();
  const to = addDays(from, Number(values.days) - 1);
  // An event on several days counts when any of its days falls in the window.
  const events = site.events.filter((event) => (event.dates ?? [event.date]).some((date) => date >= from && date <= to));
  const kirtan = site.recurring?.find((entry) => entry.id === 'kirtan');
  if (kirtan) {
    for (let date = from; date <= to; date = addDays(date, 1)) {
      if (weekday(date) === 'сб' && !events.some((event) => (event.dates ?? [event.date]).includes(date) && /киртан/i.test(event.title))) {
        events.push({
          id: `${date}-kirtan`,
          date,
          time: kirtan.times?.[0] ?? '18:00',
          title: kirtan.title,
          description: defaults.descriptions?.kirtan,
          poster: kirtan.poster
        });
      }
    }
  }
  return events
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .map((event) => ({ ...event, weekday: weekday(event.date) }));
}

const userChats = () =>
  (process.env.TG_USER_REPOST_CHATS ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [link, ...name] = entry.split('=');
      return { link: link.trim(), name: name.join('=').trim() || link.trim() };
    });

const partners = () =>
  (process.env.TG_PARTNERS ?? 'VeronikaKirpichenko')
    .split(',')
    .map((partner) => partner.trim().replace(/^@/, ''))
    .filter(Boolean);

async function telegram(method, body, isForm = false) {
  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    ...(isForm ? { body } : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  });
  const json = await response.json();
  if (!json.ok) throw new Error(`${method}: ${json.description}`);
  return json.result;
}

// Without a Telethon session: the ready album + text go to you, to forward by hand.
async function sendToMe(posters, html) {
  const chatId = process.env.TELEGRAM_APPROVAL_CHAT_ID;
  const fits = html.length <= 1024;
  if (posters.length) {
    const form = new FormData();
    form.set('chat_id', chatId);
    form.set('photo', new Blob([await readFile(posters[0])], { type: 'image/jpeg' }), 'poster.jpg');
    if (fits) {
      form.set('caption', html);
      form.set('parse_mode', 'HTML');
    }
    await telegram('sendPhoto', form, true);
  }
  if (!posters.length || !fits) {
    await telegram('sendMessage', { chat_id: chatId, text: html, parse_mode: 'HTML', disable_web_page_preview: true });
  }
}

const events = await weekEvents();
if (!events.length) {
  await notify(`📭 В афише на ближайшие ${values.days} дней пусто — подборку для чатов и партнёров не собираю. Пришлите анонсы, и запустите /week.`);
  process.exit(0);
}
// Links to the channel posts: events published from now on remember theirs (`post`); for older ones the post is found
// in the channel's public feed by its date and title.
async function findPosts(events) {
  const channel = (process.env.TELEGRAM_CHANNEL_ID ?? '@omhome_thai').replace(/^@/, '');
  let feed = [];
  try {
    const page = await (await fetch(`https://t.me/s/${channel}`, { signal: AbortSignal.timeout(20_000) })).text();
    feed = page
      .split(`data-post="${channel}/`)
      .slice(1)
      .map((block) => ({
        id: block.split('"')[0],
        text: (block.match(/js-message_text[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '').replace(/<[^>]+>/g, ' ').toLowerCase()
      }));
  } catch (error) {
    console.warn(`⚠️  Лента канала недоступна — без ссылок на посты: ${error.message}`);
  }
  for (const event of events) {
    if (event.post) continue;
    // The post for the event's first day (the newest one if it was posted twice).
    const match = (event.dates ?? [event.date])
      .map((date) => feed.findLast((post) => post.text.includes(event.title.toLowerCase()) && post.text.includes(shortDate(date))))
      .find(Boolean);
    if (match) event.post = `https://t.me/${channel}/${match.id}`;
  }
}

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

await findPosts(events);
// One event is told properly — the kirtan (FEATURE, a regexp), otherwise the first one; the rest are listed with links.
const featurePattern = new RegExp(process.env.WEEKLY_FEATURE ?? 'киртан', 'i');
const feature = events.find((event) => featurePattern.test(event.title)) ?? events[0];
const others = events.filter((event) => event !== feature);
const poster = [feature, ...others].map((event) => posterFile(event.poster)).find((path) => path && existsSync(path));
const lastDate = (event) => (event.dates ?? [event.date]).at(-1);
const span = `${shortDate(events[0].date)}–${shortDate(events.map(lastDate).sort().at(-1))}`;
await notify(
  `🗓 Подборка на неделю (${span}): ${events.length} событ., в центре — ${feature.title}.\n${events.map((event) => `• ${daysText(event)}, ${event.time} — ${event.title}${event.post ? '' : ' (поста в канале не нашёл)'}`).join('\n')}\n\nПишу текст — превью придёт следом.`
);

const listLine = (event) => {
  const name = `${event.title}${event.subtitle ? ` (${event.subtitle})` : ''}`;
  const when = daysText(event).replace(/^./, (letter) => letter.toUpperCase());
  return `• ${escapeHtml(when)}, ${event.time} — ${event.post ? `<a href="${event.post}">${escapeHtml(name)}</a>` : escapeHtml(name)}`;
};

let intro;
const write = async () => {
  try {
    intro = await writeWeekIntro(feature, others);
  } catch (error) {
    console.warn(`⚠️  Текст без Gemini — ${error.message}`);
    intro = digestPlain([feature]);
  }
};
const html = () =>
  [
    digestHtml(intro ?? ''),
    ...(others.length ? ['', '<b>Ещё на неделе:</b>', ...others.map(listLine)] : []),
    '',
    digestFooter()
  ].join('\n');

const targets = [
  ...userChats().map((chat) => ({ target: `chat:${chat.link}`, name: `«${chat.name}»` })),
  ...partners().map((partner) => ({ target: `user:${partner}`, name: `@${partner} (сначала приветствие)` }))
];
const workDir = await mkdtemp(join(tmpdir(), 'omhome-week-'));

// One text for everyone: approved once, then sent to every chat and partner.
const results = await runWithApproval([
  {
    label: () =>
      userSession
        ? `🗓 Анонс недели → ${targets.map((target) => target.name).join(', ')} с вашего аккаунта`
        : `🗓 Анонс недели для ${targets.map((target) => target.name).join(', ')} — пришлю вам, перешлите сами`,
    image: poster,
    text: html,
    prepare: async () => {
      if (!intro) await write();
    },
    // ❌ → reply with what to change («короче», «больше про киртан»), or «заново» for a fresh text.
    onEdit: async ({ text: instruction }) => {
      if (!instruction) return;
      if (/^(заново|ещё|еще|другой|перепиши)\b/i.test(instruction.trim())) await write();
      else intro = await editDigest(intro, instruction);
    },
    run: async () => {
      const posters = poster ? [poster] : [];
      if (!userSession) return sendToMe(posters, html());
      const file = join(workDir, 'week.html');
      await writeFile(file, html());
      for (const { target } of targets) {
        execFileSync('python3', [PARTNER_SCRIPT, '--digest', target, file, ...posters], { stdio: 'inherit' });
      }
    }
  }
]);
await notify(results[0]?.status === 'done' ? '🏁 Анонс недели отправлен.' : '⏭ Анонс недели не отправлен.');
