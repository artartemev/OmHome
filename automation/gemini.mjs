// AI helpers for the announcement pipeline: polish/expand/shorten a description (Gemini) and generate a poster photo
// (Cloudflare Workers AI FLUX first — free daily quota; Gemini image models as a fallback once billing is enabled).
// Env: GEMINI_API_KEY (Google AI Studio); CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN (optional, for FLUX).
// Models fall back in order when one is overloaded (503) or out of quota (429).

import { writeFile } from 'node:fs/promises';

const API = 'https://generativelanguage.googleapis.com/v1beta/models';
// Free tier: about 20 requests a day per model, so the chain is long — each model has its own daily quota.
export const TEXT_MODELS = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3-flash-preview', 'gemini-2.5-flash', 'gemini-flash-latest'];
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
  shorten: 'Сократи описание до 1–2 предложений, оставив главное.',
  vary: 'Перескажи описание по-новому — другими словами и с другим началом, чтобы оно не повторяло прошлые анонсы дословно. Сохрани смысл, все факты и примерно ту же длину.'
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

// FLUX has no negative prompt: words like «no text» only put text into the picture, so the styles never mention
// it — the scene itself avoids objects with writing, and every result is checked for lettering (see generatePhoto).
const IMAGE_STYLES = {
  // Line-art like the old kirtan posters in Figma. Tried on 3 events: empty frames, garbled lettering — not the default.
  illustration: 'elegant flat illustration, fine golden line art on a deep teal background, ornamental and calm, minimal, centered composition',
  photo:
    'warm candid photograph, soft natural evening light, cosy bright home interior with plants, rugs and floor cushions, film photography, shallow depth of field'
};

// Gemini turns the event into a short English scene for FLUX: concrete objects of this event, no text, no alcohol.
async function imagePrompt(event, style) {
  const ask = `Write one English prompt (max 45 words) for an image generator, describing a single scene for the event poster below.
Show concrete objects or actions of this exact event (e.g. a glowing projector beam in a dark room for a movie night, a straw hat with folded blank paper slips for the word game "Шляпа", a teapot and small cups for a tea evening, a harmonium and karatals for kirtan).
Few people or none, faces not in focus. Image generators draw broken lettering, so choose only objects that carry no writing at all: no signs, posters, books, notes with words, labels, screens, packaging, logos; also no bottles or alcohol.
Do not mention text, letters or words in the prompt at all — just describe what IS in the scene. Only the prompt, nothing else.
Event: ${event.title}${event.subtitle ? ` (${event.subtitle})` : ''}. ${event.description ?? ''}`;
  try {
    const { json } = await generate(TEXT_MODELS, { contents: [{ parts: [{ text: ask }] }], generationConfig: { temperature: 0.4 } });
    const scene = json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();
    if (scene) return `${scene}. ${IMAGE_STYLES[style]}`;
  } catch {
    // fall through to the plain prompt
  }
  return `${event.title}. ${IMAGE_STYLES[style]}`;
}

// Gemini looks at a generated picture: FLUX sometimes still paints pseudo-lettering, such a picture is redrawn.
async function hasLettering(path) {
  const { readFile } = await import('node:fs/promises');
  const mimeType = /\.png$/i.test(path) ? 'image/png' : 'image/jpeg';
  const { json } = await generate(TEXT_MODELS, {
    contents: [{
      parts: [
        { inlineData: { mimeType, data: (await readFile(path)).toString('base64') } },
        { text: 'Is there any visible text, letters, numbers, signs or pseudo-writing anywhere in this image? Answer only YES or NO.' }
      ]
    }],
    generationConfig: { temperature: 0 }
  });
  return /yes/i.test(json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '');
}

export async function generatePhoto(event, out, { style = process.env.IMAGE_STYLE || 'photo', attempts = 3 } = {}) {
  const prompt = await imagePrompt(event, style);
  let cloudflareError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      // Workers AI now and then answers «Unknown internal error»: one more try after a pause usually works.
      const path = await generateWithCloudflare(prompt, out.replace(/\.png$/, '.jpg')).catch(async (error) => {
        console.warn(`⚠️  Cloudflare: ${error.message} — пробую ещё раз`);
        await sleep(5000);
        return generateWithCloudflare(prompt, out.replace(/\.png$/, '.jpg'));
      });
      // The check is best effort: without Gemini the picture is kept (the poster is approved by you anyway).
      const lettering = await hasLettering(path).catch(() => false);
      if (!lettering || attempt === attempts) return path;
      console.log(`🔁 ${event.title}: на картинке проступили буквы — рисую заново (${attempt + 1}/${attempts})`);
    } catch (error) {
      cloudflareError = error;
      break;
    }
  }
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
    // The prompt travels with the error, so you can draw the picture yourself (e.g. in Gemini or Midjourney).
    throw Object.assign(new Error(`${cloudflareError.message}; ${geminiError.message}`), { prompt });
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

// An edit from the approval dialogue («время 19:00», «убери последнее предложение», «подзаголовок — с Сашей»):
// the current announcement as a strict block + the instruction → the whole block again, changed only where asked.
export async function editAnnouncement(block, instruction, today) {
  const prompt = `Сегодня ${today}. Вот анонс события OmHome в строгом формате расписания:

${block}

Формат: строка «ДД/ММ ЧЧ:ММ», строка «Название» или «Название | подзаголовок», описание, строки «инста: @ник» и «✍️ Запись: @ник» (если есть).

Правка организатора: «${instruction.trim()}»

Внеси эту правку и верни весь анонс целиком в том же формате. Меняй только то, о чём просят, остальное оставь дословно.
Если просят переписать текст — пиши тепло и по-дружески, в стиле OmHome, без новых фактов.
Верни только анонс, без пояснений.`;
  const { json } = await generate(TEXT_MODELS, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2 }
  });
  const answer = json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim() ?? '';
  return answer.replace(/^```\w*\n?|```$/g, '').trim();
}

// Attached photos without labels: Gemini looks at them and says which photo fits which event.
// Returns an array: for each event, the index of its photo (or -1). Falls back to the given order.
export async function matchPhotos(events, photoPaths) {
  const { readFile } = await import('node:fs/promises');
  const parts = [];
  for (const [index, path] of photoPaths.entries()) {
    const mimeType = /\.png$/i.test(path) ? 'image/png' : /\.webp$/i.test(path) ? 'image/webp' : 'image/jpeg';
    parts.push({ text: `Фото ${index + 1}:` }, { inlineData: { mimeType, data: (await readFile(path)).toString('base64') } });
  }
  const list = events
    .map((event, index) => `${index + 1}. ${event.title}${event.subtitle ? ` (${event.subtitle})` : ''}${event.description ? ` — ${event.description.slice(0, 160)}` : ''}`)
    .join('\n');
  parts.push({
    text: `События:\n${list}\n\nПодбери к каждому событию самое подходящее фото (каждое фото — не больше одного раза).
Ответь только строками вида «событие=фото», например «1=3». Если подходящего фото нет — «1=0».`
  });
  const { json } = await generate(TEXT_MODELS, { contents: [{ parts }], generationConfig: { temperature: 0 } });
  const answer = json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
  const result = events.map(() => -1);
  const used = new Set();
  for (const [, eventNo, photoNo] of answer.matchAll(/(\d+)\s*=\s*(\d+)/g)) {
    const e = Number(eventNo) - 1;
    const p = Number(photoNo) - 1;
    if (e >= 0 && e < events.length && p >= 0 && p < photoPaths.length && !used.has(p)) {
      result[e] = p;
      used.add(p);
    }
  }
  return result;
}
