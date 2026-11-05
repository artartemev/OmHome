import { test } from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { parseSchedule, foldIntoMain, formatPost, guessCategory, wantsOnePost, looksStrict, mergeRepeats, toScheduleBlock, toSiteEvent } from '../announcement.mjs';

const today = '2026-10-11';

test('parses several events in the house format', () => {
  const events = parseSchedule(
    `сб 17/10 18:00
Киртан
Поём мантры вместе, чай после

19.10 17:00
Шляпа | настольная игра

20 октября 11:00 и 18:00
Чайная | медитация и дегустация
📍 Адрес (https://maps.app.goo.gl/x)
💰 Донейшен`,
    { today }
  );
  assert.equal(events.length, 3);
  assert.deepEqual(
    events.map((e) => [e.date, e.time, e.title, e.subtitle ?? null]),
    [
      ['2026-10-17', '18:00', 'Киртан', null],
      ['2026-10-19', '17:00', 'Шляпа', 'настольная игра'],
      ['2026-10-20', '11:00', 'Чайная', 'медитация и дегустация']
    ]
  );
  assert.equal(events[0].description, 'Поём мантры вместе, чай после');
  assert.equal(events[1].id, '2026-10-19-shlyapa');
  assert.deepEqual(events[2].times, ['11:00', '18:00']);
  assert.equal(events[2].description, undefined);
});

test('warns when the written weekday does not match the date', () => {
  const [event] = parseSchedule('сб 15/10 18:00\nМантра-йога', { today });
  assert.equal(event.weekday, 'чт');
  assert.equal(event.warnings.length, 1);
});

test('dates long in the past roll over to next year', () => {
  const [event] = parseSchedule('05/01 19:00\nНовогодний киртан', { today });
  assert.equal(event.date, '2027-01-05');
});

test('a date inside the description does not start a new event', () => {
  const events = parseSchedule('18/10 18:00\nКино\nСледующий показ 25.10, приходите', { today });
  assert.equal(events.length, 1);
});

test('formats the channel post', () => {
  const [event] = parseSchedule('17/10 18:00\nКиртан\nПоём вместе', { today });
  assert.equal(
    formatPost(event),
    [
      '<b>СБ ✦ 17/10 ✦ 18:00</b>',
      '',
      '<b>Киртан</b>',
      '',
      'Поём вместе',
      '',
      '📍 <a href="https://maps.app.goo.gl/Vm2WUEd4D6yL8JQG7">Адрес</a>',
      '✍️ Запись: @artartemev',
      '💰 Донейшен'
    ].join('\n')
  );
});

test('instagram notes are taken out of the post and kept as handles', () => {
  const [inline, own] = parseSchedule(
    `чт 15/10 18:00
Мантра-йога | с Дашей
Вечер проведёт Даша (@daria_tokarchuk) ✨ в инсте она au_darya

сб 17/10 18:00
Киртан
Поём вместе
инста: @some.guest`,
    { today }
  );
  assert.equal(inline.description, 'Вечер проведёт Даша (@daria_tokarchuk) ✨');
  assert.deepEqual(inline.instagram, ['au_darya']);
  assert.equal(own.description, 'Поём вместе');
  assert.deepEqual(own.instagram, ['some.guest']);
  assert.ok(!formatPost(inline).includes('au_darya'));
});

test('own contact line replaces the default, and mantra-yoga is not a kirtan', () => {
  const [hat, yoga, kirtan] = parseSchedule(
    `18/10 17:00
Шляпа | настольная игра
Играем в настолку
✍️ Запись: @Wasyaphi

15/10 18:00
Мантра-йога | с Дашей

17/10 18:00
Киртан`,
    { today }
  );
  assert.equal(hat.contact, '@Wasyaphi');
  assert.equal(hat.description, 'Играем в настолку');
  assert.ok(formatPost(hat).includes('✍️ Запись: @Wasyaphi'));
  assert.ok(formatPost(yoga).includes('✍️ Запись: @artartemev'));
  assert.equal(guessCategory(yoga), 'practice');
  assert.equal(guessCategory(kirtan), 'kirtan');
});

test('an event survives the round trip through its schedule block (used for edits)', () => {
  const [event] = parseSchedule(
    'чт 15/10 18:00\nМантра-йога | с Дашей\nПриглашаем окунуться в звуки.\nВечер проведёт Даша ✨ в инсте она au_darya\n✍️ Запись: @daria_tokarchuk',
    { today: '2026-10-11' }
  );
  const [again] = parseSchedule(toScheduleBlock(event), { today: '2026-10-11' });
  assert.deepEqual(again, event);
});

test('free text that only looks like a schedule goes to Gemini', () => {
  const strict = parseSchedule('пт 16/10 18:00\nКвартирник\nПоём песни.', { today: '2026-10-15' });
  assert.equal(looksStrict(strict), true);
  const free = parseSchedule('ср 21/10\n11:00 23 октября бранч у Никиты, запись @nikitosnik', { today: '2026-10-15' });
  assert.equal(looksStrict(free), false);
  assert.equal(looksStrict([]), false);
});

test('one event on several days: one announcement with all the dates', () => {
  const [event] = parseSchedule('21/10 и 23/10 11:00\nМастер-класс по Го\nРазберём правила.', { today: '2026-10-15' });
  assert.deepEqual(event.dates, ['2026-10-21', '2026-10-23']);
  assert.equal(event.id, '2026-10-21-master-klass-po-go');
  assert.match(formatPost(event), /^<b>СР 21\/10 и ПТ 23\/10 ✦ 11:00<\/b>/);
  // Gemini may still split it in two — they are merged back.
  const split = parseSchedule('21/10 11:00\nМастер-класс по Го\n\n23/10 11:00\nМастер-класс по Го', { today: '2026-10-15' });
  const merged = mergeRepeats(split);
  assert.equal(merged.length, 1);
  assert.deepEqual(merged[0].dates, ['2026-10-21', '2026-10-23']);
  // And the block for edits keeps both dates.
  assert.deepEqual(parseSchedule(toScheduleBlock(event), { today: '2026-10-15' })[0].dates, event.dates);
});

test('days in a row read as a range — in the text, the post and back', () => {
  const [event] = parseSchedule('с 26/10 по 01/11 20:30\nКиртан', { today: '2026-10-22' });
  assert.equal(event.dates.length, 7);
  assert.match(formatPost(event), /^<b>С 26\/10 по 01\/11 ✦ 20:30<\/b>/);
  const [listed] = parseSchedule('26/10 и 27/10 и 28/10 и 31/10 20:30\nКиртан', { today: '2026-10-22' });
  assert.match(formatPost(listed), /^<b>С 26\/10 по 28\/10 и СБ 31\/10 ✦ 20:30<\/b>/);
  assert.deepEqual(parseSchedule(toScheduleBlock(event), { today: '2026-10-22' })[0].dates, event.dates);
});

test('notices a request for one post', () => {
  for (const text of ['сделай два анонса в одном посте', 'Одним постом, пожалуйста', 'общий пост на оба', 'объедини их в пост', 'оба одной публикацией', 'и в этом же анонсе добавь информацию', 'в том же посте напиши']) {
    assert.equal(wantsOnePost(text), true, text);
  }
  for (const text of ['в субботу киртан, в воскресенье Шляпа', 'один из лучших фильмов', 'пост в канал']) {
    assert.equal(wantsOnePost(text), false, text);
  }
});

test('a mention stays in the post after the description and survives an edit', () => {
  const [event] = parseSchedule('сб 07/11 18:00\nКиртан\nПоём\nтакже: До понедельника в 20:30 — лампады, подробности: omhome.space/kartika', { today });
  assert.equal(event.description, 'Поём');
  assert.match(formatPost(event), /Поём\n\nДо понедельника в 20:30 — лампады, подробности: omhome\.space\/kartika\n\n📍/);
  const [back] = parseSchedule(toScheduleBlock(event), { today });
  assert.equal(back.also, event.also);
  assert.equal(back.description, 'Поём');
});

test('the site shows the mention as part of the description', () => {
  const [event] = parseSchedule('сб 07/11 18:00\nКиртан\nПоём\nтакже: Лампады', { today });
  const site = toSiteEvent(event, '/posters/a.jpg');
  assert.equal(site.description, 'Поём\n\nЛампады');
  assert.equal(site.also, undefined);
});

test('one post keeps one event, the others become its mention', () => {
  const events = parseSchedule('сб 07/11 18:00\nКиртан\nПоём\n\nвс 08/11 20:30\nЛампады\nЦеремония', { today });
  const folded = foldIntoMain(events);
  assert.equal(folded.length, 1);
  assert.equal(folded[0].title, 'Киртан');
  assert.equal(folded[0].description, 'Поём');
  assert.match(folded[0].also, /08\/11, 20:30 — Лампады\. Церемония/);
  assert.deepEqual(foldIntoMain(events.slice(0, 1)), events.slice(0, 1));
});

test('poster templates use only files from automation: the server clone has nothing else', () => {
  const dir = new URL('../poster/', import.meta.url);
  for (const name of ['template.html', 'story_frame.html']) {
    const html = readFileSync(new URL(name, dir), 'utf8');
    const files = [...html.matchAll(/url\('([^']+)'\)/g)].map((match) => match[1]).filter((path) => !/^(data:|https?:)/.test(path));
    assert.ok(files.length, name);
    for (const file of files) {
      assert.ok(!file.startsWith('..'), `${name}: ${file}`);
      assert.ok(existsSync(new URL(file, dir)), `${name}: ${file}`);
    }
  }
});
