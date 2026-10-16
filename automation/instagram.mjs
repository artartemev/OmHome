import { stat } from 'node:fs/promises';

// Instagram publishing through the official Instagram API with Instagram Login (token starts with IG…).
//
// Env:
//   IG_USER_ID        optional: Instagram professional account id (default: me)
//   IG_ACCESS_TOKEN   Instagram User token (IG…) with instagram_business_content_publish
//   IG_PUBLIC_BASE_URL where posters are publicly reachable, default https://omhome.space
//
// Instagram downloads the image itself, so the poster must already be online: commit and deploy public/posters first.
// Not exercised against a live account yet — the first run should be watched.

const GRAPH = 'https://graph.instagram.com/v21.0';

export const instagramConfigured = () => Boolean(process.env.IG_ACCESS_TOKEN);

// With Instagram Login the token already belongs to the account, so "me" works when IG_USER_ID is not set.
const account = () => process.env.IG_USER_ID || 'me';

export function publicUrl(localPath) {
  const base = (process.env.IG_PUBLIC_BASE_URL ?? 'https://omhome.space').replace(/\/$/, '');
  return `${base}/${localPath.replace(/^public\//, '')}`;
}

async function graph(path, params) {
  const body = new URLSearchParams({ ...params, access_token: process.env.IG_ACCESS_TOKEN });
  const response = await fetch(`${GRAPH}/${path}`, { method: 'POST', body });
  const json = await response.json();
  if (json.error) throw new Error(`Instagram: ${json.error.message}`);
  return json;
}

// Right after the site commit Vercel still builds for a minute or two: wait until the poster online is the same
// file as the local one (same size), so Instagram never picks up an older version.
async function assertOnline(url, localPath, timeoutMs = 8 * 60 * 1000) {
  const expected = localPath ? (await stat(localPath)).size : null;
  const deadline = Date.now() + timeoutMs;
  let status;
  while (Date.now() < deadline) {
    const response = await fetch(`${url}?v=${Date.now()}`, { method: 'HEAD', cache: 'no-store' }).catch(() => null);
    status = response?.status ?? 'нет ответа';
    const size = Number(response?.headers.get('content-length'));
    if (status === 200 && (expected === null || !size || size === expected)) return;
    await new Promise((resolve) => setTimeout(resolve, 10_000));
  }
  throw new Error(`${url}: на сайте ещё нет этой версии афиши (${status}) — обновите сайт и повторите`);
}

async function waitUntilReady(containerId) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const response = await fetch(`${GRAPH}/${containerId}?fields=status_code&access_token=${process.env.IG_ACCESS_TOKEN}`);
    const { status_code: status } = await response.json();
    if (status === 'FINISHED') return;
    if (status === 'ERROR') throw new Error('Instagram не смог обработать картинку');
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new Error('Instagram слишком долго обрабатывает картинку');
}

async function publish(params, localPath) {
  await assertOnline(params.image_url, localPath);
  const container = await graph(`${account()}/media`, params);
  await waitUntilReady(container.id);
  // Right after FINISHED Instagram often answers "Media ID is not available" / "resource does not exist" for a few
  // seconds: wait and retry the publish step a few times before giving up.
  let lastError;
  for (let attempt = 0; attempt < 6; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, attempt === 0 ? 5000 : 10_000));
    try {
      return await graph(`${account()}/media_publish`, { creation_id: container.id });
    } catch (error) {
      lastError = error;
      if (!/not available|does not exist|not ready/i.test(error.message)) throw error;
    }
  }
  throw lastError;
}

// → link to the published post (for the «поделись в историю» reminder).
export async function publishPost(imagePath, caption) {
  const { id } = await publish({ image_url: publicUrl(imagePath), caption }, imagePath);
  try {
    const response = await fetch(`${GRAPH}/${id}?fields=permalink&access_token=${process.env.IG_ACCESS_TOKEN}`);
    return (await response.json()).permalink ?? null;
  } catch {
    return null;
  }
}

export const publishStory = (imagePath) =>
  publish({ image_url: publicUrl(imagePath), media_type: 'STORIES' }, imagePath);

// Telegram captions are HTML; Instagram wants plain text and does not make links clickable.
export function toInstagramCaption(htmlCaption, extra = '') {
  const text = htmlCaption
    // «📍 Адрес» is only a link — useless in Instagram, where the address is in the profile header (see `extra`).
    .replace(/^📍 <a [^>]*>[^<]*<\/a>\n?/m, '')
    // Links are not clickable in Instagram captions: keep the donation URL as plain text, drop the rest.
    .replace(/<a href="(https:\/\/omhome\.space\/donate)">[^<]+<\/a>/g, 'поддержать: omhome.space/donate')
    .replace(/<a href="([^"]+)">([^<]+)<\/a>/g, '$2')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    // Telegram usernames would tag random Instagram accounts: show them as t.me links instead.
    .replace(/(^|[\s(])@([A-Za-z0-9_]{4,})/g, '$1t.me/$2');
  return `${text}${extra}`;
}
