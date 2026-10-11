# Автоматизация афиш OmHome

Короткое сообщение с расписанием превращается в афиши в фирменном стиле, блок «Афиша» на сайте и посты в Telegram.

```
расписание (текст) ──► announcement.mjs ──► события (дата, время, название, описание)
                                         ├─► poster/render.mjs ──► public/posters/<id>.jpg и <id>-story.jpg
                                         ├─► public/events.json ──► блок «Афиша» на omhome.space
                                         └─► formatPost() ──► пост в @omhome_thai + пересылка в дружественные чаты
```

## Формат сообщения

Одно или несколько событий, между ними пустая строка:

```
сб 17/10 18:00
Киртан
Поём мантры вместе, чай после

18.10 17:00
Шляпа | настольная игра

20 октября 11:00 и 18:00
Чайная | медитация и дегустация
```

- Первая строка: дата (`17/10`, `17.10`, `17 октября`), день недели (необязательно) и время. Если день недели не совпадает с датой, скрипт предупредит.
- Вторая строка: название. Через `|` можно добавить подзаголовок: на афише он встаёт маленькой строкой над названием.
- Остальные строки: описание. Подвал анонса (📍 адрес, ✍️ запись, 💰 донейшен) добавляется сам.

## Запуск

```bash
# пробный прогон: афиши + events.json + текст постов в консоль
npm run publish:events -- schedule.txt --photo "Киртан=./kirtan.jpg" --photo "Шляпа=./hat.jpg"

# одна афиша вручную
node automation/poster/render.mjs --date 2026-10-17 --time 18:00 --title "Киртан" --photo ./kirtan.jpg --palette teal --out public/posters/2026-10-17-kirtan

# публикация в канал и пересылка по чатам
TELEGRAM_BOT_TOKEN=... TELEGRAM_CHANNEL_ID=@omhome_thai TELEGRAM_REPOST_CHAT_IDS=-100123,-100456 \
  npm run publish:events -- schedule.txt --photo "*=./photo.jpg" --send
```

`--photo "*=path"` задаёт одно фото для всех событий.

Цвет афиши закреплён за типом события (цвета взяты из афиш в Figma): киртан — `teal`, кино — `ocean`, игры — `navy`, практики — `sea`, чай — `olive`, беседы — `brown`. `--palette` переопределяет.

## Нейросети

```bash
# текст: polish — поправить, expand — расширить, shorten — сократить (Gemini 3.8 Flash, запасные 3.5 Flash / Flash Latest)
npm run publish:events -- schedule.txt --ai-text expand --photo "*=./photo.jpg"

# фото: если для события не передано --photo, оно генерируется
npm run publish:events -- schedule.txt --ai-photo
```

- Ключи кладутся в `.env` в корне (файл в `.gitignore`): `GEMINI_API_KEY=...`, при желании `CLOUDFLARE_ACCOUNT_ID=...` и `CLOUDFLARE_API_TOKEN=...`. Перед запуском: `set -a; . ./.env; set +a`.
- Фото рисует Cloudflare Workers AI (FLUX.1 schnell, бесплатно 10 000 «нейронов» в сутки — хватает с запасом на 5–7 картинок в неделю). Запасной вариант — Gemini (Nano Banana), но на бесплатном тарифе AI Studio у него квота 0, нужен биллинг.
- Cloudflare: зарегистрируйтесь на dash.cloudflare.com → Workers AI → «Use REST API»: там Account ID и кнопка создания API-токена с правом Workers AI.

## Репост партнёрам

Бот не может написать человеку первым, поэтому партнёрам (@VeronikaKirpichenko) афиша уходит с вашего аккаунта через Telethon — той же сессией, что в проекте guide. С `--send` это происходит автоматически, если заданы `TG_API_ID`, `TG_API_HASH`, `TG_SESSION` (путь к .session). Первым сообщением уходит «Привет) вот анонс на грядущую неделю - буду благодарен за репост», вторым — афиша с текстом. Список партнёров: `TG_PARTNERS=VeronikaKirpichenko,другой_ник`.

## Архив

```bash
python3 automation/archive/scrape_channel.py omhome_thai > /tmp/channel.json   # все посты канала из публичного веб-превью
python3 automation/archive/build_archive.py /tmp/channel.json                  # → public/archive.json + public/archive/*.jpg
```

Ручные правки (переименовать, сменить категорию, убрать отменённое, добавить пропущенное) — в `automation/archive/overrides.json`.

После прогона закоммитьте `public/events.json` и `public/posters/`: Vercel пересоберёт сайт, и афиша обновится.

## Тесты

```bash
npm test
```
