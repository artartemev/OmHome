// Vercel serverless function: forwards the PAMHO participation form to Telegram.
// The bot token lives only in Vercel env vars (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID), never in the client bundle.

type JoinPayload = {
  language?: string;
  fields?: Record<string, string>;
};

const MAX_FIELD_LENGTH = 1000;

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: 'Telegram is not configured' });
  }

  const body: JoinPayload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {};
  const fields = Object.entries(body.fields ?? {})
    .filter(([key, value]) => typeof key === 'string' && typeof value === 'string')
    .slice(0, 10)
    .map(([key, value]) => `${escapeHtml(key.slice(0, 80))}: ${escapeHtml(value.slice(0, MAX_FIELD_LENGTH))}`);

  if (fields.length === 0) {
    return res.status(400).json({ ok: false, error: 'Empty form' });
  }

  const title = body.language === 'en' ? 'New application from the OmHome website' : 'Новая заявка с сайта OmHome';
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: [`<b>${title}</b>`, ...fields].join('\n'), parse_mode: 'HTML' })
  });

  return res.status(response.ok ? 200 : 502).json({ ok: response.ok });
}
