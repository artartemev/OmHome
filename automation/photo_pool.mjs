// Rotating photos for recurring events without an attached photo (e.g. the Saturday kirtan).
// automation/photos/<category>/ holds the pool; automation/photos/history.json remembers when each photo was used,
// so every time the least recently used one is taken and the same photo never appears twice in a row.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const ROOT = resolve('automation/photos');
const HISTORY = join(ROOT, 'history.json');

async function readHistory() {
  try {
    return JSON.parse(await readFile(HISTORY, 'utf8'));
  } catch {
    return {};
  }
}

export async function pickPoolPhoto(category) {
  let files;
  try {
    files = (await readdir(join(ROOT, category))).filter((file) => /\.(jpe?g|png|webp)$/i.test(file)).sort();
  } catch {
    return null;
  }
  if (!files.length) return null;
  const history = (await readHistory())[category] ?? {};
  // Never used first, then the oldest use.
  files.sort((a, b) => (history[a] ?? '').localeCompare(history[b] ?? ''));
  return join(ROOT, category, files[0]);
}

export async function markPoolPhotoUsed(photoPath, date) {
  if (!photoPath?.startsWith(ROOT)) return;
  const [category, file] = photoPath.slice(ROOT.length + 1).split('/');
  const history = await readHistory();
  history[category] = { ...(history[category] ?? {}), [file]: date };
  await writeFile(HISTORY, `${JSON.stringify(history, null, 2)}\n`);
}
