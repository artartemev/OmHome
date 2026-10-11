// Parses a free-form schedule message into events and formats channel posts in the OmHome style.
//
// Input (one or many events, separated by a blank line before the next date line):
//
//   сб 18/10 18:00
//   Киртан
//   Поём мантры вместе, чай после
//
//   19.10 17:00
//   Шляпа | настольная игра
//
// The first line of each block holds the date (18/10, 18.10, 18 октября) with an optional weekday and time.
// The second line is the title; "Title | subtitle" splits off the small line shown above/below it on the poster.
// Everything after that is the description.

export const DEFAULTS = {
  mapUrl: 'https://maps.app.goo.gl/Vm2WUEd4D6yL8JQG7',
  contact: '@artartemev',
  donation: 'Донейшен',
  timeZoneOffsetHours: 7
};

const MONTHS = {
  янв: 1, фев: 2, мар: 3, апр: 4, мая: 5, май: 5, июн: 6, июл: 7, авг: 8, сен: 9, окт: 10, ноя: 11, дек: 12
};
const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

const DATE_NUMERIC = /(?<!\d)(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?(?!\d)/;
const DATE_WORDS = /(?<!\d)(\d{1,2})\s+(янв|фев|мар|апр|мая|май|июн|июл|авг|сен|окт|ноя|дек)[а-я]*/i;
// A new event starts only with a line that begins with a weekday or a day number, right after a blank line.
const DATE_LINE_START = /^((пн|вт|ср|чт|пт|сб|вс)[\s,.]*)?\d/i;
const TIME = /(?<!\d)([01]?\d|2[0-3])[:.]([0-5]\d)(?!\d)/g;

const pad = (n) => String(n).padStart(2, '0');

export function todayIso(now = new Date(), offsetHours = DEFAULTS.timeZoneOffsetHours) {
  const local = new Date(now.getTime() + offsetHours * 3_600_000);
  return `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}`;
}

function parseDateLine(line, today) {
  let day;
  let month;
  let year;
  const numeric = line.match(DATE_NUMERIC);
  const words = line.match(DATE_WORDS);
  if (words) {
    day = Number(words[1]);
    month = MONTHS[words[2].toLowerCase()];
  } else if (numeric) {
    day = Number(numeric[1]);
    month = Number(numeric[2]);
    if (numeric[3]) year = Number(numeric[3].length === 2 ? `20${numeric[3]}` : numeric[3]);
  } else {
    return null;
  }
  if (!month || month > 12 || day < 1 || day > 31) return null;

  if (!year) {
    // Pick the nearest upcoming occurrence: a date more than a month in the past means next year.
    const [ty, tm, td] = today.split('-').map(Number);
    year = ty;
    const candidate = Date.UTC(year, month - 1, day);
    if (candidate < Date.UTC(ty, tm - 1, td) - 31 * 86_400_000) year += 1;
  }

  const dateOnly = line.replace(DATE_WORDS, ' ').replace(DATE_NUMERIC, ' ');
  const times = [...dateOnly.matchAll(TIME)].map((m) => `${pad(m[1])}:${m[2]}`);
  const date = `${year}-${pad(month)}-${pad(day)}`;
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  const writtenWeekday = line.toLowerCase().match(/(?:^|[^а-я])(пн|вт|ср|чт|пт|сб|вс)(?![а-я])/)?.[1];

  return {
    date,
    time: times[0] ?? '18:00',
    times: times.length ? times : ['18:00'],
    weekday,
    warnings:
      writtenWeekday && writtenWeekday !== weekday
        ? [`В тексте «${writtenWeekday}», но ${pad(day)}/${pad(month)}/${year} — это «${weekday}». Проверь дату.`]
        : []
  };
}

const TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
};

const slugify = (text) =>
  [...text.toLowerCase()]
    .map((char) => TRANSLIT[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

export function parseSchedule(message, { today = todayIso() } = {}) {
  const lines = message.replace(/\r/g, '').split('\n');
  const blocks = [];
  let current = null;

  for (const raw of lines) {
    const line = raw.trim();
    const looksLikeDate = DATE_LINE_START.test(line) && (!current || current.lastBlank);
    const dateInfo = looksLikeDate ? parseDateLine(line, today) : null;
    if (dateInfo) {
      current = { dateInfo, lines: [], lastBlank: false };
      blocks.push(current);
      continue;
    }
    if (!current) continue;
    if (!line) {
      current.lastBlank = true;
      continue;
    }
    // Lines that repeat the standard footer are dropped; the footer is added back when formatting.
    if (/^(📍|✍️|✍|💰)/u.test(line)) continue;
    current.lines.push(line);
    current.lastBlank = false;
  }

  return blocks
    .filter((block) => block.lines.length > 0)
    .map(({ dateInfo, lines: [titleLine, ...rest] }) => {
      const [title, subtitle] = titleLine.split('|').map((part) => part.trim());
      return {
        id: `${dateInfo.date}-${slugify(title)}`,
        date: dateInfo.date,
        time: dateInfo.time,
        times: dateInfo.times,
        weekday: dateInfo.weekday,
        title,
        ...(subtitle ? { subtitle } : {}),
        ...(rest.length ? { description: rest.join('\n') } : {}),
        warnings: dateInfo.warnings
      };
    });
}

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function shortDate(date) {
  const [, month, day] = date.split('-');
  return `${day}/${month}`;
}

// Event type → poster palette. Fixed so every kind of evening keeps its own colour.
const CATEGORY_RULES = [
  ['kirtan', /киртан|мантр|бхаджан|прасад/i],
  ['cinema', /кино|фильм|мульт|смотрим/i],
  ['games', /квиз|werewolf|оборот|мафи|шляп|настол|игр|rpg|детектив/i],
  ['practice', /йог|нидр|медитац|чаш|дыхан|практик/i],
  ['tea', /ча[йяю]|чаепит|посиделк/i],
  ['talks', /бесед|чтени|читк|пьес|лекци|философ|стих/i]
];

export const CATEGORY_PALETTE = {
  kirtan: 'teal',
  cinema: 'ocean',
  games: 'navy',
  practice: 'sea',
  tea: 'olive',
  talks: 'brown',
  other: 'teal'
};

export function guessCategory(event) {
  const text = `${event.title} ${event.subtitle ?? ''}`;
  return CATEGORY_RULES.find(([, pattern]) => pattern.test(text))?.[0] ?? 'other';
}

// Telegram post in the channel's house format (parse_mode: HTML).
export function formatPost(event, options = {}) {
  const { mapUrl, contact, donation } = { ...DEFAULTS, ...options };
  const when = `${event.weekday.toUpperCase()} ✦ ${shortDate(event.date)} ✦ ${(event.times ?? [event.time]).join(' и ')}`;
  const title = event.subtitle ? `${event.title} — ${event.subtitle}` : event.title;
  return [
    `<b>${escapeHtml(when)}</b>`,
    '',
    `<b>${escapeHtml(title)}</b>`,
    ...(event.description ? ['', escapeHtml(event.description)] : []),
    '',
    `📍 <a href="${mapUrl}">Адрес</a>`,
    `✍️ Запись: ${escapeHtml(contact)}`,
    `💰 ${escapeHtml(donation)}`
  ].join('\n');
}

// Shape stored in public/events.json for the website.
export function toSiteEvent(event, posterPath) {
  const { warnings, times, weekday, ...rest } = event;
  return { ...rest, ...(posterPath ? { poster: posterPath } : {}) };
}
