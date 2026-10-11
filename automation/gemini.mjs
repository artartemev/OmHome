// AI helpers for the announcement pipeline: polish/expand/shorten a description (Gemini) and generate a poster photo
// (Cloudflare Workers AI FLUX first — free daily quota; Gemini image models as a fallback once billing is enabled).
// Env: GEMINI_API_KEY (Google AI Studio); CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN (optional, for FLUX).
// Models fall back in order when one is overloaded (503) or out of quota (429).

import { writeFile } from 'node:fs/promises';

const API = 'https://generativelanguage.googleapis.com/v1beta/models';
export const TEXT_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
// Image generation needs billing enabled on the AI Studio project: on the free tier these return 429 (quota 0).
export const IMAGE_MODELS = ['gemini-3-pro-image', 'gemini-3.1-flash-image', 'gemini-2.5-flash-image'];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generate(models, body, { attempts = 3, timeoutMs = 90_000 } = {}) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set');
  const errors = [];
  for (const model of models) {
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        const response = await fetch(`${API}/${model}:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(timeoutMs)
        });
        const json = await response.json();
        if (response.ok) return { model, json };
        errors.push(`${model}: ${json.error?.code} ${json.error?.status}`);
        if (response.status === 429 || response.status === 404) break; // no quota / no model: next model
      } catch (error) {
        errors.push(`${model}: ${error.name}`);
      }
      await sleep(2000 * 2 ** attempt);
    }
  }
  throw new Error(`Gemini недоступен: ${errors.join('; ')}`);
}

const HOUSE_STYLE = `Ты пишешь анонсы для OmHome — комьюнити-пространства в Чиангмае (киртаны, кино, квизы, йога, чайные вечера).
Тон: тёплый, дружеский, живой, на «вы» к группе, без пафоса и канцелярита, 0–2 уместных эмодзи.
Не выдумывай факты: имена, цены, время и условия бери только из исходного текста.
Не добавляй дату, адрес, запись и донейшен — они добавляются отдельно.
Верни только текст описания, без заголовка и кавычек.`;

const TASKS = {
  polish: 'Отредактируй описание: исправь ошибки, сделай читабельнее, сохрани длину и смысл.',
  expand: 'Расширь описание до 3–4 предложений: что будет, для кого, какое настроение. Без новых фактов.',
  shorten: 'Сократи описание до 1–2 предложений, оставив главное.'
};

export async function rewriteDescription(event, mode = 'polish') {
  const source = [`Название: ${event.title}`, event.subtitle && `Подзаголовок: ${event.subtitle}`, `Описание: ${event.description ?? '(нет)'}`]
    .filter(Boolean)
    .join('\n');
  const { json } = await generate(TEXT_MODELS, {
    systemInstruction: { parts: [{ text: HOUSE_STYLE }] },
    contents: [{ parts: [{ text: `${TASKS[mode] ?? TASKS.polish}\n\n${source}` }] }]
  });
  const text = json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();
  if (!text) throw new Error('Gemini вернул пустой ответ');
  return text;
}

const CLOUDFLARE_MODEL = '@cf/black-forest-labs/flux-1-schnell';

async function generateWithCloudflare(prompt, out) {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!account || !token) throw new Error('CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN не заданы');
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${CLOUDFLARE_MODEL}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, steps: 8 }),
    signal: AbortSignal.timeout(120_000)
  });
  const json = await response.json();
  const image = json.result?.image;
  if (!response.ok || !image) throw new Error(`Cloudflare: ${json.errors?.[0]?.message ?? response.status}`);
  await writeFile(out, Buffer.from(image, 'base64'));
  return out;
}

export async function generatePhoto(event, out) {
  const prompt = `Atmospheric photo for an event poster: "${event.title}"${event.subtitle ? ` (${event.subtitle})` : ''}.
${event.description ?? ''}
Cozy community house in Chiang Mai, warm evening light, real people, candid, soft film look, no text, no logos, vertical 4:5.`;
  try {
    return await generateWithCloudflare(prompt, out.replace(/\.png$/, '.jpg'));
  } catch (cloudflareError) {
    try {
      const { model, json } = await generate(
        IMAGE_MODELS,
        { contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ['IMAGE'] } },
        { attempts: 2, timeoutMs: 180_000 }
      );
      const image = json.candidates?.[0]?.content?.parts?.find((part) => part.inlineData)?.inlineData;
      if (!image) throw new Error(`${model} не вернул картинку`);
      await writeFile(out, Buffer.from(image.data, 'base64'));
      return out;
    } catch (geminiError) {
      throw new Error(`${cloudflareError.message}; ${geminiError.message}`);
    }
  }
}

const WEEKDAYS_RU = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

// Free-text announcement → the strict schedule format parseSchedule() understands. The model writes that format
// directly (with an example to copy), and parseSchedule() then validates it — dates, weekdays, Instagram notes.
export async function structureAnnouncement(text, today) {
  const [y, m, d] = today.split('-').map(Number);
  const weekday = WEEKDAYS_RU[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const prompt = `Сегодня ${today}, ${weekday}. Перепиши анонс организатора OmHome в строгий формат расписания.

Формат: события разделены пустой строкой. У каждого события:
1) строка «ДД/ММ ЧЧ:ММ» (дата ближайшего такого дня после сегодня; «в шесть вечера» = 18:00; нет времени — 18:00);
2) строка «Название» или «Название | подзаголовок» (название 1–3 слова, как на афише; подзаголовок — коротко, например «с Дашей»);
3) описание — слова организатора, можно поправить опечатки и связать фразы, но без новых фактов; если описания нет — пропусти строку;
4) если сказано про инстаграм человека — строка «инста: @ник»;
5) если сказано, к кому записываться, — строка «✍️ Запись: @ник».
Ничего не выдумывай и не добавляй лишнего текста, только расписание.

Пример.
Анонс: «в пятницу в 7 смотрим Интерстеллар, обсуждаем после. в субботу киртан с Сашей, инста у него sasha.music»
Ответ:
16/10 19:00
Интерстеллар | кинопоказ
Смотрим «Интерстеллар», после — обсуждение.

17/10 18:00
Киртан | с Сашей
инста: @sasha.music

Анонс: «${text.trim()}»
Ответ:`;
  const { json } = await generate(TEXT_MODELS, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0 }
  });
  const answer = json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim() ?? '';
  return answer.replace(/^```\w*\n?|```$/g, '').trim();
}
