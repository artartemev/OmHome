// Instagram publishing through the official Instagram Graph API (professional account linked to a Facebook Page).
//
// Env:
//   IG_USER_ID        Instagram professional account id (not the @handle)
//   IG_ACCESS_TOKEN   long-lived token with instagram_content_publish
//   IG_PUBLIC_BASE_URL where posters are publicly reachable, default https://omhome.space
//
// Instagram downloads the image itself, so the poster must already be online: commit and deploy public/posters first.
// Not exercised against a live account yet — the first run should be watched.

const GRAPH = 'https://graph.facebook.com/v21.0';

export const instagramConfigured = () => Boolean(process.env.IG_USER_ID && process.env.IG_ACCESS_TOKEN);

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

async function assertOnline(url) {
  const response = await fetch(url, { method: 'HEAD' });
  if (!response.ok) throw new Error(`${url} недоступен (${response.status}) — сначала задеплойте афиши на сайт`);
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

async function publish(params) {
  await assertOnline(params.image_url);
  const container = await graph(`${process.env.IG_USER_ID}/media`, params);
  await waitUntilReady(container.id);
  return graph(`${process.env.IG_USER_ID}/media_publish`, { creation_id: container.id });
}

export const publishPost = (imagePath, caption) => publish({ image_url: publicUrl(imagePath), caption });

export const publishStory = (imagePath) => publish({ image_url: publicUrl(imagePath), media_type: 'STORIES' });

// Telegram captions are HTML; Instagram wants plain text and does not make links clickable.
export function toInstagramCaption(htmlCaption, extra = '') {
  const text = htmlCaption
    // Links are not clickable in Instagram captions: keep the donation URL as plain text, drop the rest.
    .replace(/<a href="(https:\/\/omhome\.space\/donate)">[^<]+<\/a>/g, 'поддержать: omhome.space/donate')
    .replace(/<a href="([^"]+)">([^<]+)<\/a>/g, '$2')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
  return `${text}${extra}`;
}
