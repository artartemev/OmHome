// The week's schedule in ONE message for friendly chats (Волшебный чат) and partners (@VeronikaKirpichenko).
//
//   node automation/weekly.mjs              # events of the next 7 days from public/events.json
//   node automation/weekly.mjs --days 10    # a longer window
//
// Announcements come one by one through the week; this runs once a week (the bot starts it on schedule or on /week)
// and gathers everything on the afisha: an album of the posters and a lively text Gemini writes for exactly that
// audience, in your voice — each audience gets its own. The Saturday kirtan is added even without its own announcement.
// Every message is previewed with ✅/❌ like everything else; on ❌ reply with an edit («короче», «добавь про пир»)
// or «заново» for a fresh text.
//
// Sent from your account (Telethon: TG_SESSION / TG_SESSION_STRING). Without a session the bot sends you the ready
// album and text, and you forward them yourself.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { digestFooter, digestHtml, digestPlain, shortDate, todayIso } from './announcement.mjs';
import { notify, runWithApproval } from './approval.mjs';
import { editDigest, writeDigest } from './gemini.mjs';

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
  const events = site.events.filter((event) => event.date >= from && event.date <= to);
  const kirtan = site.recurring?.find((entry) => entry.id === 'kirtan');
  if (kirtan) {
    for (let date = from; date <= to; date = addDays(date, 1)) {
      if (weekday(date) === 'сб' && !events.some((event) => event.date === date && /киртан/i.test(event.title))) {
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
  const form = new FormData();
  form.set('chat_id', chatId);
  const media = posters.slice(0, 10).map((_, index) => ({
    type: 'photo',
    media: `attach://p${index}`,
    ...(index === 0 && html.length <= 1024 ? { caption: html, parse_mode: 'HTML' } : {})
  }));
  form.set('media', JSON.stringify(media));
  for (const [index, poster] of posters.slice(0, 10).entries()) {
    form.set(`p${index}`, new Blob([await readFile(poster)], { type: 'image/jpeg' }), `poster${index}.jpg`);
  }
  await telegram('sendMediaGroup', form, true);
  if (html.length > 1024) await telegram('sendMessage', { chat_id: chatId, text: html, parse_mode: 'HTML', disable_web_page_preview: true });
}

const events = await weekEvents();
if (!events.length) {
  await notify(`📭 В афише на ближайшие ${values.days} дней пусто — подборку для чатов и партнёров не собираю. Пришлите анонсы, и запустите /week.`);
  process.exit(0);
}
const posters = [...new Set(events.map((event) => posterFile(event.poster)).filter((path) => path && existsSync(path)))];
const span = `${shortDate(events[0].date)}–${shortDate(events.at(-1).date)}`;
await notify(
  `🗓 Подборка на неделю (${span}): ${events.length} событ.\n${events.map((event) => `• ${event.weekday} ${shortDate(event.date)}, ${event.time} — ${event.title}`).join('\n')}\n\nПишу тексты — превью придут следом.`
);

const audiences = [
  ...userChats().map((chat) => ({
    kind: 'chats',
    target: `chat:${chat.link}`,
    name: `«${chat.name}»`,
    audience: `сообщение в дружественный Telegram-чат «${chat.name}». Ты пишешь его участникам как свой человек в этом чате — по-соседски, просто и дружелюбно`
  })),
  ...partners().map((partner) => ({
    kind: 'partners',
    target: `user:${partner}`,
    name: `@${partner}`,
    audience: `текст, который @${partner} перепостит у себя в канале. Ты обращаешься к подписчикам этого канала: они тебя, скорее всего, не знают, поэтому одной фразой представься и скажи, что такое OmHome`,
    intro: true
  }))
];

const workDir = await mkdtemp(join(tmpdir(), 'omhome-week-'));
const written = []; // texts already written this run — the next audience gets a different one
const actions = audiences.map((audience, index) => {
  let text;
  const write = async () => {
    try {
      text = await writeDigest(events, audience.audience, { avoid: written });
    } catch (error) {
      console.warn(`⚠️  ${audience.name}: текст без Gemini — ${error.message}`);
      text = digestPlain(events);
    }
    written.push(text);
  };
  const html = () => `${digestHtml(text ?? '')}\n\n${digestFooter()}`;
  return {
    label: userSession
      ? `${audience.intro ? '💌' : '🔁'} Подборка на неделю → ${audience.name} с вашего аккаунта${audience.intro ? ' (сначала приветствие)' : ''}`
      : `📨 Подборка для ${audience.name} — пришлю вам, перешлите сами`,
    image: posters[0],
    text: html,
    prepare: async () => {
      if (!text) await write();
    },
    onEdit: async ({ text: instruction }) => {
      if (!instruction) return;
      if (/^(заново|ещё|еще|другой|перепиши)\b/i.test(instruction.trim())) await write();
      else text = await editDigest(text, instruction);
    },
    run: async () => {
      if (!userSession) return sendToMe(posters, html());
      const file = join(workDir, `digest-${index}.html`);
      await writeFile(file, html());
      execFileSync('python3', [PARTNER_SCRIPT, '--digest', audience.target, file, ...posters], { stdio: 'inherit' });
    }
  };
});

const results = await runWithApproval(actions);
const done = results.filter((result) => result.status === 'done').length;
await notify(`🏁 Подборка на неделю: отправлено ${done} из ${actions.length}.`);
