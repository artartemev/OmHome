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
  donateUrl: 'https://omhome.space/donate',
  // Link to the donation details in the post footer — off for now, turn on with formatPost(event, { donateLink: true }).
  donateLink: false,
  timeZoneOffsetHours: 7
};

const MONTHS = {
  янв: 1, фев: 2, мар: 3, апр: 4, мая: 5, май: 5, июн: 6, июл: 7, авг: 8, сен: 9, окт: 10, ноя: 11, дек: 12
};
const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

const DATE_NUMERIC = /(?<!\d)(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?(?!\d)/;
const DATE_WORDS = /(?<!\d)(\d{1,2})\s+(янв|фев|мар|апр|мая|май|июн|июл|авг|сен|окт|ноя|дек)[а-я]*/i;
// A new event starts only with a line that begins with a weekday or a day number, right after a blank line.
const DATE_LINE_START = /^((пн|вт|ср|чт|пт|сб|вс)[\s,.]*)?(с\s+)?\d/i;
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

  // «21/10 и 23/10 11:00» — the same event on several days: one announcement, one poster, all the dates.
  // «с 26/10 по 01/11», «26/10–01/11» — every day of the range.
  const range = line.match(/(\d{1,2})[./](\d{1,2})\s*(?:-|–|—|по)\s*(\d{1,2})[./](\d{1,2})/);
  const rangeDays = [];
  if (range && !words) {
    const [ty] = today.split('-').map(Number);
    const endYear = Number(range[4]) < month ? Math.max(year, ty) + 1 : year;
    const end = Date.UTC(endYear, Number(range[4]) - 1, Number(range[3]));
    for (let t = Date.UTC(year, month - 1, day) + 86_400_000; t <= end && rangeDays.length < 62; t += 86_400_000) {
      rangeDays.push(new Date(t).toISOString().slice(0, 10));
    }
  }
  const more = words
    ? []
    : range
      ? rangeDays
      : [...line.matchAll(new RegExp(DATE_NUMERIC.source, 'g'))].slice(1).map((m) => {
        const [ty] = today.split('-').map(Number);
        const y = m[3] ? Number(m[3].length === 2 ? `20${m[3]}` : m[3]) : Number(m[2]) < month ? Math.max(year, ty) + 1 : year;
        return `${y}-${pad(Number(m[2]))}-${pad(Number(m[1]))}`;
        });

  const dateOnly = line.replace(DATE_WORDS, ' ').replace(new RegExp(DATE_NUMERIC.source, 'g'), ' ');
  const times = [...dateOnly.matchAll(TIME)].map((m) => `${pad(m[1])}:${m[2]}`);
  const date = `${year}-${pad(month)}-${pad(day)}`;
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  const writtenWeekday = line.toLowerCase().match(/(?:^|[^а-я])(пн|вт|ср|чт|пт|сб|вс)(?![а-я])/)?.[1];

  const dates = [...new Set([date, ...more])].sort();
  return {
    date: dates[0],
    ...(dates.length > 1 ? { dates } : {}),
    time: times[0] ?? '18:00',
    times: times.length ? times : ['18:00'],
    weekday: WEEKDAYS[new Date(`${dates[0]}T00:00:00Z`).getUTCDay()],
    warnings:
      dates.length === 1 && writtenWeekday && writtenWeekday !== weekday
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

// Notes for Instagram only: "инста: @au_darya", "ig: au_darya" as a separate line, or "… в инсте она au_darya"
// inside a line. The handle is tagged in the Instagram caption and removed from the Telegram post and the site.
const IG_LINE = /^(?:ig|insta|инста|инстаграм|instagram)\s*[:—-]\s*@?([A-Za-z0-9._]+)\s*$/i;
const IG_PHRASE = /[\s,;—-]*(?:а\s+)?в\s+(?:инст[а-яё]*|instagram|ig)\s*(?:(?:она|он|они)\s+)?[—:-]?\s*@?([A-Za-z0-9._]+)/i;

function takeInstagram(line, handles) {
  const own = line.match(IG_LINE);
  if (own) {
    handles.push(own[1]);
    return '';
  }
  const phrase = line.match(IG_PHRASE);
  if (phrase) {
    handles.push(phrase[1]);
    return line.replace(IG_PHRASE, '').trim();
  }
  return line;
}

export function parseSchedule(message, { today = todayIso() } = {}) {
  const lines = message.replace(/\r/g, '').split('\n');
  const blocks = [];
  let current = null;

  for (const raw of lines) {
    const line = raw.trim();
    const looksLikeDate = DATE_LINE_START.test(line) && (!current || current.lastBlank);
    const dateInfo = looksLikeDate ? parseDateLine(line, today) : null;
    if (dateInfo) {
      current = { dateInfo, lines: [], instagram: [], lastBlank: false };
      blocks.push(current);
      continue;
    }
    if (!current) continue;
    if (!line) {
      current.lastBlank = true;
      continue;
    }
    // Lines that repeat the standard footer are dropped; the footer is added back when formatting.
    const contact = line.match(/^(?:✍️|✍)?\s*запись\s*(?:у|:|—|-)?\s*:?\s*(@[A-Za-z0-9_]{4,})\s*$/iu);
    if (contact && current.lines.length) {
      current.contact = contact[1];
      continue;
    }
    if (/^(📍|✍️|✍|💰)/u.test(line)) continue;
    const text = current.lines.length ? takeInstagram(line, current.instagram) : line;
    current.lastBlank = false;
    if (text) current.lines.push(text);
  }

  return blocks
    .filter((block) => block.lines.length > 0)
    .map(({ dateInfo, instagram, contact, lines: [titleLine, ...rest] }) => {
      const [title, subtitle] = titleLine.split('|').map((part) => part.trim());
      return {
        id: `${dateInfo.date}-${slugify(title)}`,
        date: dateInfo.date,
        ...(dateInfo.dates ? { dates: dateInfo.dates } : {}),
        time: dateInfo.time,
        times: dateInfo.times,
        weekday: dateInfo.weekday,
        title,
        ...(subtitle ? { subtitle } : {}),
        ...(rest.length ? { description: rest.join('\n') } : {}),
        ...(instagram.length ? { instagram: [...new Set(instagram)] } : {}),
        ...(contact ? { contact } : {}),
        warnings: dateInfo.warnings
      };
    });
}

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const weekdayOf = (date) => WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];

// «ср 21/10» or, for an event on several days, «ср 21/10 и пт 23/10».
// Days that follow one another (three or more) read as a range: «с 26/10 по 01/11», not seven dates in a row.
export function dateGroups(dates) {
  const sorted = [...new Set(dates)].sort();
  const runs = [];
  for (const date of sorted) {
    const last = runs.at(-1);
    const next = last && new Date(Date.parse(`${last.at(-1)}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
    if (next === date) last.push(date);
    else runs.push([date]);
  }
  return runs.flatMap((run) => (run.length >= 3 ? [{ from: run[0], to: run.at(-1) }] : run.map((date) => ({ date }))));
}

// «ср 21/10», «ср 21/10 и пт 23/10», «с 26/10 по 01/11».
export function daysText(event) {
  return dateGroups(event.dates ?? [event.date])
    .map((group) => (group.date ? `${weekdayOf(group.date)} ${shortDate(group.date)}` : `с ${shortDate(group.from)} по ${shortDate(group.to)}`))
    .join(' и ');
}

// The same for the poster's top line: small words (weekday, «с», «по», «и») and large dates.
export function whenParts(dates) {
  return dateGroups(dates).flatMap((group, index) => [
    ...(index ? [{ small: 'и' }] : []),
    ...(group.date
      ? [{ small: weekdayOf(group.date) }, { big: shortDate(group.date) }]
      : [{ small: 'с' }, { big: shortDate(group.from) }, { small: 'по' }, { big: shortDate(group.to) }])
  ]);
}

export function shortDate(date) {
  const [, month, day] = date.split('-');
  return `${day}/${month}`;
}

// Event type → poster palette. Fixed so every kind of evening keeps its own colour.
const CATEGORY_RULES = [
  // Yoga first: «мантра-йога» is a practice, not a kirtan (kirtan gets its own colour and default description).
  ['practice', /йог|нидр|медитац|чаш|дыхан|практик/i],
  ['kirtan', /киртан|мантр|бхаджан|прасад/i],
  ['cinema', /кино|фильм|мульт|смотрим/i],
  ['games', /квиз|werewolf|оборот|мафи|шляп|настол|игр|rpg|детектив/i],
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
  const { mapUrl, donation, donateUrl, donateLink } = { ...DEFAULTS, ...options };
  const contact = event.contact ?? options.contact ?? DEFAULTS.contact;
  const time = (event.times ?? [event.time]).join(' и ');
  const when = event.dates?.length > 1
    ? `${daysText(event).toUpperCase().replace(/ (И|С|ПО) /g, (word) => word.toLowerCase()).replace(/^С /, 'С ')} ✦ ${time}`
    : `${event.weekday.toUpperCase()} ✦ ${shortDate(event.date)} ✦ ${time}`;
  const title = event.subtitle ? `${event.title} — ${event.subtitle}` : event.title;
  return [
    `<b>${escapeHtml(when)}</b>`,
    '',
    `<b>${escapeHtml(title)}</b>`,
    ...(event.description ? ['', escapeHtml(event.description)] : []),
    '',
    `📍 <a href="${mapUrl}">Адрес</a>`,
    `✍️ Запись: ${escapeHtml(contact)}`,
    donateLink ? `💰 ${escapeHtml(donation)} · <a href="${donateUrl}">поддержать OmHome</a>` : `💰 ${escapeHtml(donation)}`
  ].join('\n');
}

// Shape stored in public/events.json for the website.
export function toSiteEvent(event, posterPath) {
  const { warnings, times, weekday, instagram, contact, formatNote, ...rest } = event;
  return { ...rest, ...(posterPath ? { poster: posterPath } : {}) };
}

// Event → the strict schedule block parseSchedule() reads back (used to edit an announcement with Gemini).
export function toScheduleBlock(event) {
  return [
    `${(event.dates ?? [event.date]).map(shortDate).join(' и ')} ${(event.times ?? [event.time]).join(' ')}`,
    event.subtitle ? `${event.title} | ${event.subtitle}` : event.title,
    ...(event.description ? [event.description.replace(/\n\s*\n/g, '\n')] : []),
    ...(event.instagram ?? []).map((handle) => `инста: @${handle}`),
    ...(event.contact ? [`✍️ Запись: ${event.contact}`] : [])
  ].join('\n');
}

// Footer of the one-message schedule for chats and partners (HTML, as for the channel).
export function digestFooter(options = {}) {
  const { mapUrl, contact } = { ...DEFAULTS, ...options };
  return [`📍 <a href="${mapUrl}">Адрес</a>`, `✍️ Запись: ${escapeHtml(contact)}`, '💰 Донейшен', '📣 Все анонсы: t.me/omhome_thai'].join('\n');
}

// The schedule as a plain list — when Gemini is not available.
export function digestPlain(events) {
  const lines = events.map((event) => `${daysText(event).toUpperCase().replace(' И ', ' и ')}, ${event.time} — ${event.title}${event.subtitle ? ` (${event.subtitle})` : ''}`);
  return `Друзья, привет! Вот что у нас в OmHome на неделе:\n\n${lines.join('\n')}\n\nПриходите, будем рады 🤍`;
}

export const digestHtml = (text) => escapeHtml(text);

// Did the strict parser really get the schedule format, or did it bite into free text? A title that is itself a date
// or a time, or a whole sentence, means free words — those go to Gemini instead.
export function looksStrict(events) {
  return (
    events.length > 0 &&
    events.every(
      (event) =>
        event.title.length <= 60 &&
        !DATE_NUMERIC.test(event.title) &&
        !DATE_WORDS.test(event.title) &&
        !/(?<!\d)([01]?\d|2[0-3])[:.][0-5]\d(?!\d)/.test(event.title)
    )
  );
}

// The same event announced for several days (or split so by Gemini) becomes ONE event with all its dates:
// one poster, one post, one card on the site.
export function mergeRepeats(events) {
  const merged = [];
  for (const event of events) {
    const same = merged.find(
      (other) =>
        other.title.toLowerCase() === event.title.toLowerCase() &&
        (other.subtitle ?? '') === (event.subtitle ?? '') &&
        other.time === event.time
    );
    if (!same) {
      merged.push({ ...event });
      continue;
    }
    same.dates = [...new Set([...(same.dates ?? [same.date]), ...(event.dates ?? [event.date])])].sort();
    same.date = same.dates[0];
    same.weekday = WEEKDAYS[new Date(`${same.date}T00:00:00Z`).getUTCDay()];
    same.id = `${same.date}-${slugify(same.title)}`;
    same.description ??= event.description;
    same.warnings = [...(same.warnings ?? []), ...(event.warnings ?? [])];
  }
  return merged;
}
