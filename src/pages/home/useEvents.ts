import { useEffect, useState } from 'react';

export type OmEvent = {
  id: string;
  date: string; // YYYY-MM-DD, Chiang Mai local date
  time: string; // HH:MM
  title: string;
  subtitle?: string;
  description?: string;
  poster?: string;
  category?: string;
  registration?: string;
};

export type RecurringEvent = {
  id: string;
  days: string;
  times: string[];
  title: string;
  subtitle?: string;
  description?: string;
  poster?: string;
};

type EventsFile = {
  updatedAt?: string;
  events: OmEvent[];
  recurring?: RecurringEvent[];
};

export const TIME_ZONE = 'Asia/Bangkok';

export const todayInChiangMai = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date());

const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

const parseDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export const formatEventDate = (date: string) => {
  const parsed = parseDate(date);
  const day = String(parsed.getUTCDate()).padStart(2, '0');
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  return { weekday: WEEKDAYS[parsed.getUTCDay()], short: `${day}/${month}` };
};

export const relativeDayLabel = (date: string, today: string) => {
  const diff = Math.round((parseDate(date).getTime() - parseDate(today).getTime()) / 86_400_000);
  if (diff === 0) return 'Сегодня';
  if (diff === 1) return 'Завтра';
  return null;
};

const pad = (value: number) => String(value).padStart(2, '0');

// Chiang Mai is UTC+7 all year round, so the conversion is a fixed offset.
const toUtcStamp = (date: string, time: string, addHours = 0) => {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day, hours - 7 + addHours, minutes));
  return `${utc.getUTCFullYear()}${pad(utc.getUTCMonth() + 1)}${pad(utc.getUTCDate())}T${pad(utc.getUTCHours())}${pad(
    utc.getUTCMinutes()
  )}00Z`;
};

export const downloadIcs = (event: OmEvent, location: string) => {
  const escape = (value: string) => value.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OmHome//Afisha//RU',
    'BEGIN:VEVENT',
    `UID:${event.id}@omhome.space`,
    `DTSTAMP:${toUtcStamp(todayInChiangMai(), '07:00')}`,
    `DTSTART:${toUtcStamp(event.date, event.time)}`,
    `DTEND:${toUtcStamp(event.date, event.time, 2)}`,
    `SUMMARY:${escape(`${event.title} · OmHome`)}`,
    `DESCRIPTION:${escape(event.description ?? event.subtitle ?? '')}`,
    `LOCATION:${escape(location)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `omhome-${event.id}.ics`;
  link.click();
  URL.revokeObjectURL(url);
};

export function useEvents() {
  const [data, setData] = useState<EventsFile | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}events.json`, { cache: 'no-cache' })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((json: EventsFile) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const today = todayInChiangMai();
  const all = [...(data?.events ?? [])].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const upcoming = all.filter((event) => event.date >= today);
  const recent = all.filter((event) => event.date < today).reverse().slice(0, 3);

  return { loading: !data && !failed, failed, today, upcoming, recent, recurring: data?.recurring ?? [] };
}

export type ArchiveEvent = {
  date: string;
  time: string | null;
  title: string;
  description: string;
  category: string;
  post: string;
  photo: string | null;
};

export type Archive = {
  since: string;
  total: number;
  byCategory: Record<string, number>;
  events: ArchiveEvent[];
};

export function useArchive() {
  const [archive, setArchive] = useState<Archive | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}archive.json`)
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((json: Archive) => {
        if (!cancelled) setArchive(json);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return archive;
}
