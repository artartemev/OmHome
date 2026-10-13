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
// Same as the guide: a regular desktop Chrome user agent. Headless Chrome otherwise says «HeadlessChrome», and Google
// answers with the limited card (rating only, no review texts).
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
// HEADED=1 opens a visible window: e.g. to sign in to Google once in that profile.
const headless = !process.env.HEADED;
const options = { locale: 'ru-RU', viewport: { width: 1280, height: 900 }, userAgent: UA };
// On a Mac the installed Google Chrome is used, so no browser download is needed.
const channel = process.platform === 'darwin' ? 'chrome' : undefined;
const browser = profile ? null : await chromium.launch({ channel, headless });
const context = profile
  ? await chromium.launchPersistentContext(profile, { ...options, channel: 'chrome', headless })
  : await browser.newContext(options);
const LIMITED = /ограниченн|limited view/i;
try {
  const page = context.pages()[0] ?? (await context.newPage());
  let mainText = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.goto(`${PLACE_URL}&hl=ru`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    if (page.url().includes('/sorry/')) throw new Error('Google: unusual traffic — попробуйте через несколько часов');

    // Cookie consent screen in some regions.
    const consent = page.locator('form[action*="consent"] button').last();
    if (await consent.count()) {
      await consent.click();
      await page.waitForLoadState('domcontentloaded');
    }

    await page.waitForSelector('h1', { timeout: 30_000 });
    // The panel loads in pieces: wait for review texts or the «limited view» banner.
    for (let i = 0; i < 12; i++) {
      await sleep(1500);
      mainText = await page.locator('div[role="main"]').first().innerText().catch(() => '');
      if ((await page.locator('span.wiI7pd').count()) || LIMITED.test(mainText)) break;
    }
    if (!LIMITED.test(mainText)) break;
    if (attempt === 0) {
      console.log('ℹ️  Google показал урезанный вид — пробую ещё раз через 20 секунд');
      await sleep(20_000);
    }
  }
  const header = mainText.match(/\n(\d[.,]\d)\n(?:\(([\d\s,.]+)\))?/);

  const tab = page.locator('button[role="tab"]').filter({ hasText: /Отзывы|Reviews/ });
  const more = page.locator('button[aria-label^="Ещё отзывы"], button[aria-label^="More reviews"]');
  // A banner (e.g. «limited view» or sign-in) may lie over the tabs: click through it, never fail on it.
  const open = (locator) => locator.first().click({ timeout: 5000 }).catch(() => locator.first().click({ force: true, timeout: 5000 })).catch(() => undefined);
  if (await tab.count()) await open(tab);
  else if (await more.count()) await open(more);
  await sleep(3000);
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => {
      const main = document.querySelector('div[role=main]') || document.body;
      const scroller = [...main.querySelectorAll('div')].find((d) => d.scrollHeight > d.clientHeight + 50);
      scroller?.scrollBy(0, 2500);
    });
    await sleep(1500);
  }
  // «Ещё» / «See more» inside a review shows its full text.
  const expanders = page.locator(
    'div[data-review-id] button[aria-expanded="false"], div[data-review-id] button.w8nwRe, div[data-review-id] button:has-text("Ещё"), div[data-review-id] button:has-text("More")'
  );
  for (const button of (await expanders.all()).slice(0, 30)) {
    await button.click({ timeout: 1000 }).catch(() => button.click({ force: true, timeout: 1000 })).catch(() => undefined);
  }
  await sleep(1000);

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
    limited: LIMITED.test(mainText),
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
  // Manual fixes (automation/reviews/overrides.json): hidden authors, full texts Google cuts with «…».
  const overrides = await readFile(resolve('automation/reviews/overrides.json'), 'utf8').then(JSON.parse).catch(() => ({}));
  data.reviews = data.reviews
    .filter((review) => !(overrides.hide ?? []).includes(review.author))
    .map((review) => ({ ...review, text: overrides.text?.[review.author] ?? review.text }));
  await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`⭐ ${data.rating} (${data.count}), отзывов с текстом: ${reviews.length} → ${OUT}`);
} finally {
  await context.close();
  await browser?.close();
}
