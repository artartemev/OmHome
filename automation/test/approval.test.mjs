import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const approvalModule = fileURLToPath(new URL('../approval.mjs', import.meta.url));

test('terminal: only actions answered "y"/"да" run', () => {
  const script = `
    import { runWithApproval } from ${JSON.stringify(approvalModule)};
    const ran = [];
    const actions = ['канал', 'чат', 'вероника'].map((name) => ({ label: name, text: name, run: async () => ran.push(name) }));
    const results = await runWithApproval(actions);
    console.log('RESULT ' + JSON.stringify({ ran, statuses: results.map((r) => r.status) }));
  `;
  const out = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    input: 'y\nn\nда\n',
    env: { ...process.env, TELEGRAM_APPROVAL_CHAT_ID: '' },
    encoding: 'utf8'
  });
  const result = JSON.parse(out.stdout.split('RESULT ')[1]);
  assert.deepEqual(result.ran, ['канал', 'вероника']);
  assert.deepEqual(result.statuses, ['done', 'skipped', 'done']);
});

test('telegram: waits for the button of its own preview, ignores other taps', async () => {
  process.env.TELEGRAM_BOT_TOKEN = 'test';
  process.env.TELEGRAM_APPROVAL_CHAT_ID = '42';
  const calls = [];
  let polls = 0;
  globalThis.fetch = async (url, init) => {
    const method = url.split('/').pop();
    const body = init?.body && typeof init.body === 'string' ? JSON.parse(init.body) : {};
    calls.push(method);
    let result = true;
    if (method === 'getUpdates' && body.offset === -1) result = [];
    else if (method === 'sendMessage') result = { message_id: 7 };
    else if (method === 'getUpdates') {
      polls += 1;
      const id = calls.filter((m) => m === 'sendMessage').length - 1;
      const batch = globalThis.__batch;
      result = [
        { update_id: polls * 10, callback_query: { id: 'x', data: 'other|y', message: { chat: { id: 42 } } } },
        { update_id: polls * 10 + 1, callback_query: { id: 'q', data: `${batch}.${id}|${id === 0 ? 'n' : 'y'}`, message: { chat: { id: 42 } } } }
      ];
    }
    return { json: async () => ({ ok: true, result }) };
  };
  const realNow = Date.now;
  const fixed = realNow();
  Date.now = () => fixed;
  globalThis.__batch = fixed.toString(36);
  const { runWithApproval } = await import(`../approval.mjs?telegram`);
  const ran = [];
  const results = await runWithApproval([
    { label: 'пост', run: async () => ran.push('пост') },
    { label: 'сториз', run: async () => ran.push('сториз') }
  ]);
  Date.now = realNow;
  assert.deepEqual(ran, ['сториз']);
  assert.deepEqual(results.map((r) => r.status), ['skipped', 'done']);
  assert.ok(calls.includes('answerCallbackQuery'));
});
