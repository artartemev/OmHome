import { useCallback, useEffect, useState } from 'react';
import { todayInChiangMai } from '../home/useEvents';
import { KARTIKA } from './content';

// The visitor's lamps and vows live in their own browser only.
const LAMPS_KEY = 'omhome.kartika.lamps';
const VOWS_KEY = 'omhome.kartika.vows';

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or blocked storage: the lamp still burns for this visit.
  }
};

export type LampLog = Record<string, number>;

export const readLamps = () => read<LampLog>(LAMPS_KEY, {});

// Brightens the site-wide candlelight (see src/flame) on a day a lamp was offered.
export const syncFlameLit = (lamps: LampLog = readLamps()) => {
  document.documentElement.style.setProperty('--flame-lit', lamps[todayInChiangMai()] ? '1' : '0');
};

export function useLamps() {
  const [lamps, setLamps] = useState<LampLog>(() => readLamps());

  const offer = useCallback(() => {
    setLamps((current) => {
      const today = todayInChiangMai();
      const next = { ...current, [today]: (current[today] ?? 0) + 1 };
      write(LAMPS_KEY, next);
      syncFlameLit(next);
      return next;
    });
  }, []);

  const total = Object.values(lamps).reduce((sum, count) => sum + count, 0);
  return { lamps, offer, total };
}

export type VowState = { chosen: string[]; own: string };

export function useVows() {
  const [vows, setVows] = useState<VowState>(() => read<VowState>(VOWS_KEY, { chosen: [], own: '' }));

  useEffect(() => write(VOWS_KEY, vows), [vows]);

  const toggle = (id: string) =>
    setVows((current) => ({
      ...current,
      chosen: current.chosen.includes(id) ? current.chosen.filter((item) => item !== id) : [...current.chosen, id]
    }));

  const setOwn = (own: string) => setVows((current) => ({ ...current, own }));

  return { vows, toggle, setOwn };
}

const DAY_MS = 24 * 60 * 60 * 1000;
const toUtc = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};

export const kartikaDays = () => {
  const days: string[] = [];
  for (let t = toUtc(KARTIKA.start); t <= toUtc(KARTIKA.end); t += DAY_MS) {
    days.push(new Date(t).toISOString().slice(0, 10));
  }
  return days;
};

export const daysBetween = (from: string, to: string) => Math.round((toUtc(to) - toUtc(from)) / DAY_MS);

export function kartikaStatus(today = todayInChiangMai()) {
  const total = daysBetween(KARTIKA.start, KARTIKA.end) + 1;
  if (today < KARTIKA.start) return { phase: 'before' as const, total, day: 0, daysLeft: daysBetween(today, KARTIKA.start) };
  if (today > KARTIKA.end) return { phase: 'after' as const, total, day: total, daysLeft: 0 };
  return { phase: 'during' as const, total, day: daysBetween(KARTIKA.start, today) + 1, daysLeft: 0 };
}
