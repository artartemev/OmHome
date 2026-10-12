// Google Maps rating and reviews of OmHome Space without an API key — the same approach as gmaps_reviews.py in the
// guide project: open the place card in headless Chromium and read the panel as a person would.
//
//   node automation/reviews/google_reviews.mjs            # → public/reviews.json (read by the site widget)
//
// From a cloud server Google shows a "limited view" (rating only, no review texts). On your Mac it works like the guide:
//   npm run reviews        # reads the reviews with the guide's Chrome profile, commits and pushes them to the site
//
// Run it once a week or so; a "limited view" or the "unusual traffic" page means "try again later", never retry hard.

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// ftid of OmHome Space on Google Maps (0x30da317d58a91421:0x602817378035bef3) → decimal cid.
const CID = BigInt('0x602817378035bef3').toString();
const PLACE_URL = `https://www.google.com/maps?cid=${CID}`;
const OUT = resolve('public/reviews.json');
const MAX_REVIEWS = 12;

async function loadChromium() {
  try {
    return (await import('playwright')).chromium;
  } catch {
    const globalRoot = execSync('npm root -g').toString().trim();
    return (await import(pathToFileURL(`${globalRoot}/playwright/index.mjs`).href)).chromium;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chromium = await loadChromium();
// On a Mac with the guide set up, its Chrome profile is picked up by itself (same as gmaps_reviews.py).
const guideProfile = `${process.env.HOME}/.chiangmai_guide_chrome`;
const profile =
  process.env.CHROME_PROFILE?.replace(/^~/, process.env.HOME ?? '') ??
  (process.platform === 'darwin' && existsSync(guideProfile) ? guideProfile : undefined);
const options = { locale: 'ru-RU', viewport: { width: 1280, height: 900 } };
const browser = profile ? null : await chromium.launch();
const context = profile
  ? await chromium.launchPersistentContext(profile, { ...options, channel: 'chrome', headless: true })
  : await browser.newContext(options);
try {
  const page = context.pages()[0] ?? (await context.newPage());
  await page.goto(`${PLACE_URL}&hl=ru`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  if (page.url().includes('/sorry/')) throw new Error('Google: unusual traffic — попробуйте через несколько часов');

  // Cookie consent screen in some regions.
  const consent = page.locator('form[action*="consent"] button').last();
  if (await consent.count()) {
    await consent.click();
    await page.waitForLoadState('domcontentloaded');
  }

  await page.waitForSelector('h1', { timeout: 30_000 });
  await sleep(4000);
  const mainText = await page.locator('div[role="main"]').first().innerText().catch(() => '');
  const header = mainText.match(/\n(\d[.,]\d)\n(?:\(([\d\s,.]+)\))?/);

  const tab = page.locator('button[role="tab"]').filter({ hasText: /Отзывы|Reviews/ });
  if (await tab.count()) await tab.first().click();
  await sleep(3000);
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => {
      const main = document.querySelector('div[role=main]') || document.body;
      const scroller = [...main.querySelectorAll('div')].find((d) => d.scrollHeight > d.clientHeight + 50);
      scroller?.scrollBy(0, 2500);
    });
    await sleep(1500);
  }
  for (const button of (await page.locator('div[data-review-id] button[aria-expanded="false"]').all()).slice(0, 30)) {
    await button.click({ timeout: 700 }).catch(() => undefined);
  }

  const reviews = await page.evaluate((max) => {
    const out = [];
    const seen = new Set();
    for (const node of document.querySelectorAll('div[data-review-id]')) {
      const id = node.getAttribute('data-review-id');
      const body = node.querySelector('span.wiI7pd');
      if (!body || seen.has(id)) continue;
      seen.add(id);
      const text = body.innerText.trim();
      if (text.length < 20) continue;
      const star = node.querySelector('span[role="img"][aria-label]');
      out.push({
        author: node.getAttribute('aria-label') || node.querySelector('.d4r55')?.innerText || 'Гость',
        rating: Number((star?.getAttribute('aria-label') || '').match(/\d/)?.[0] ?? 5),
        text,
        when: node.querySelector('span.rsqaWe')?.innerText ?? undefined,
        photo: node.querySelector('img')?.getAttribute('src') ?? undefined
      });
      if (out.length >= max) break;
    }
    return out;
  }, MAX_REVIEWS);

  const data = {
    fetchedAt: new Date().toISOString().slice(0, 10),
    rating: header ? Number(header[1].replace(',', '.')) : undefined,
    count: header?.[2] ? Number(header[2].replace(/\D/g, '')) : undefined,
    limited: mainText.includes('ограниченная версия') || mainText.includes('limited view'),
    mapsUrl: PLACE_URL,
    reviews
  };
  if (!data.rating && reviews.length === 0) throw new Error('Google показал урезанную карточку — попробуйте позже');
  // A limited view has no texts: keep the reviews collected earlier instead of wiping them from the site.
  if (reviews.length === 0) {
    const previous = await readFile(OUT, 'utf8').then(JSON.parse).catch(() => null);
    if (previous?.reviews?.length) {
      data.reviews = previous.reviews;
      data.limited = previous.limited;
      console.log('ℹ️  Google показал урезанный вид — оставляю отзывы из прошлого раза');
    }
  }
  await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`⭐ ${data.rating} (${data.count}), отзывов с текстом: ${reviews.length} → ${OUT}`);
} finally {
  await context.close();
  await browser?.close();
}
