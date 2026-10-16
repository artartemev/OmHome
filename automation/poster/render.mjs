// Renders an OmHome poster (1080×1350 post and 1080×1920 story) from the HTML template with headless Chromium.
//
//   node automation/poster/render.mjs --date 2026-10-17 --time 18:00 --title "Киртан" \
//        --photo ./photo.jpg --palette teal --out public/posters/2026-10-17-kirtan
//
// Writes <out>.jpg (post) and <out>-story.jpg (story).

import { mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

// Background colours sampled from the Figma posters.
export const PALETTES = {
  teal: { background: '#0d393c', accent: '#cfba8b' },
  brown: { background: '#5e3d2a', accent: '#d9a46a' },
  navy: { background: '#130e48', accent: '#f2c96b' },
  ocean: { background: '#0a2e48', accent: '#e8c77b' },
  sea: { background: '#438287', accent: '#e6d3a3' },
  olive: { background: '#4e3c14', accent: '#e6d3a3' }
};

const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const here = dirname(fileURLToPath(import.meta.url));

async function loadChromium() {
  try {
    return (await import('playwright')).chromium;
  } catch {
    // Cloud sessions ship Playwright globally rather than in node_modules.
    const { execSync } = await import('node:child_process');
    const globalRoot = execSync('npm root -g').toString().trim();
    return (await import(pathToFileURL(`${globalRoot}/playwright/index.mjs`).href)).chromium;
  }
}

export async function renderPoster({ date, dates, time, title, subtitle, photo, palette = 'teal', out, formats = ['post', 'story'] }) {
  const [year, month, day] = date.split('-').map(Number);
  const colors = PALETTES[palette] ?? PALETTES.teal;
  const photoUrl = /^https?:|^data:/.test(photo) ? photo : pathToFileURL(resolve(photo)).href;
  const base = {
    weekday: WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()],
    date: `${String(day)}/${String(month).padStart(2, '0')}`,
    // Several days of the same event: «ср 21/10 и пт 23/10» in the top line.
    days: (dates ?? [date]).map((day) => {
      const [y, m, d] = day.split('-').map(Number);
      return { weekday: WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()], date: `${d}/${String(m).padStart(2, '0')}` };
    }),
    time,
    title,
    subtitle,
    photo: photoUrl,
    ...colors
  };

  const chromium = await loadChromium();
  const browser = await chromium.launch();
  const written = [];
  try {
    await mkdir(dirname(resolve(out)), { recursive: true });
    for (const format of formats) {
      const height = format === 'story' ? 1920 : 1350;
      const page = await browser.newPage({ viewport: { width: 1080, height } });
      await page.addInitScript((poster) => {
        window.POSTER = poster;
      }, { ...base, format });
      await page.goto(pathToFileURL(resolve(here, 'template.html')).href);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.body.dataset.fitted === '1');
      await page.waitForFunction(() => {
        const img = document.getElementById('photo');
        return img.complete && img.naturalWidth > 0;
      });
      const path = `${out}${format === 'story' ? '-story' : ''}.jpg`;
      await page.screenshot({ path, type: 'jpeg', quality: 88 });
      written.push(path);
      await page.close();
    }
  } finally {
    await browser.close();
  }
  return written;
}

// Story version of a ready poster (e.g. from Figma): the poster centred on a 1080×1920 frame of its own colour.
export async function storyFromPoster(posterPath, out) {
  const chromium = await loadChromium();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    // A data URL keeps the canvas untainted, so the page can read the poster's corner colour.
    const dataUrl = `data:image/jpeg;base64,${(await readFile(posterPath)).toString('base64')}`;
    await page.addInitScript((src) => {
      window.POSTER_SRC = src;
    }, dataUrl);
    await page.goto(pathToFileURL(resolve(here, 'story_frame.html')).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.body.dataset.ready === '1');
    await page.screenshot({ path: out, type: 'jpeg', quality: 88 });
    return out;
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { values } = parseArgs({
    options: {
      date: { type: 'string' },
      time: { type: 'string', default: '18:00' },
      title: { type: 'string' },
      subtitle: { type: 'string' },
      photo: { type: 'string' },
      palette: { type: 'string', default: 'teal' },
      out: { type: 'string' }
    }
  });
  for (const key of ['date', 'title', 'photo', 'out']) {
    if (!values[key]) {
      console.error(`--${key} is required`);
      process.exit(1);
    }
  }
  const files = await renderPoster(values);
  console.log(files.join('\n'));
}
