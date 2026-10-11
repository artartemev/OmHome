import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSchedule, formatPost } from '../announcement.mjs';

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
