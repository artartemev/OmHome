import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

test('kirtan photos rotate: least recently used first, no repeats until the pool is exhausted', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'pool-'));
  await mkdir(join(dir, 'automation/photos/kirtan'), { recursive: true });
  for (const name of ['a.jpg', 'b.jpg', 'c.jpg']) await writeFile(join(dir, 'automation/photos/kirtan', name), '');
  await writeFile(join(dir, 'automation/photos/history.json'), JSON.stringify({ kirtan: { 'a.jpg': '2026-10-17' } }));
  const cwd = process.cwd();
  process.chdir(dir);
  try {
    const { pickPoolPhoto, markPoolPhotoUsed } = await import(
      `${new URL('../photo_pool.mjs', import.meta.url).href}?${Date.now()}`
    );
    const picked = [];
    for (const date of ['2026-10-24', '2026-10-31', '2026-11-07', '2026-11-14']) {
      const photo = await pickPoolPhoto('kirtan');
      picked.push(photo.split('/').pop());
      await markPoolPhotoUsed(photo, date);
    }
    assert.deepEqual(picked, ['b.jpg', 'c.jpg', 'a.jpg', 'b.jpg']);
    assert.equal(await pickPoolPhoto('cinema'), null);
  } finally {
    process.chdir(cwd);
  }
});
