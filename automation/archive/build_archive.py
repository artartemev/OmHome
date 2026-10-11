"""Turns the scraped channel posts into the events archive shown on omhome.space.

    python3 automation/archive/scrape_channel.py omhome_thai > channel.json
    python3 automation/archive/build_archive.py channel.json            # writes public/archive.json + public/archive/*.jpg

Announcements changed format over the year ("Среда, 15 октября 18:00 — Title", "📅 Среда, 29 октября" + "🧠 15:00 — Title",
"26/02 • Чт • 18:00" + title on the next line…), so every line is classified as a date line, a time line or text, and
events are assembled from that. Reminders that repeat an already announced event are merged by (date, title).
"""
import io
import json
import re
import sys
import time
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT_JSON = ROOT / "public" / "archive.json"
OUT_PHOTOS = ROOT / "public" / "archive"

MONTHS = {"янв": 1, "фев": 2, "мар": 3, "апр": 4, "мая": 5, "май": 5, "июн": 6, "июл": 7, "авг": 8, "сен": 9,
          "окт": 10, "ноя": 11, "дек": 12}
NUMERIC_DATE = re.compile(r"(?<![\d:.])(\d{1,2})\s*[/.]\s*(\d{1,2})(?![\d:])(?!\.\d)")
WORD_DATE = re.compile(r"(?<!\d)(\d{1,2})\s+(янв|фев|мар|апр|мая|май|июн|июл|авг|сен|окт|ноя|дек)[а-я]*", re.I)
TIME = re.compile(r"(?<![\d/])([01]?\d|2[0-3])[:.]([0-5]\d)(?![\d/])")
WEEKDAY_WORDS = re.compile(
    r"\b(понедельник|вторник|среда|среду|четверг|пятница|пятницу|суббота|субботу|воскресенье|пн|вт|ср|чт|пт|сб|вс)\b",
    re.I)
SEPARATOR = re.compile(r"^[\s—⸻\-–_]{2,}$")
SERVICE = re.compile(r"^\W*(запис|💰|💸|✍|📍|подробност|донейш|донат|🎟|⚠|место|участие)", re.I)
EMOJI = re.compile(r"[\U0001F000-\U0001FAFF☀-➿⬀-⯿️‍]")

CATEGORIES = [
    ("games", r"квиз|werewolf|оборот|мафи|шляп|настол|игр|rpg|письма призрака|\bго\b|лил"),
    ("kirtan", r"киртан|мантр|бхаджан|ом-чантинг|прасад"),
    ("cinema", r"кино|фильм|мультфильм|мультик|смотрим|кинопоказ"),
    ("practice", r"йог|нидр|медитац|чаш|дыхан|гвозд|психосомат|расстанов|звуки света|практик"),
    ("tea", r"ча[йяю]|чаепит|посиделк"),
    ("talks", r"бесед|чтени|читк|пьес|лекци|философ|стих|поэт|разговор"),
    ("creative", r"мастер-класс|арт|нейрограф|театр|playback|swap|творч|танц"),
]


def clean(text):
    text = EMOJI.sub("", text)
    return re.sub(r"\s+", " ", text).strip(" •·|—–-:,.!")


def find_date(line, post_date):
    m = WORD_DATE.search(line)
    if m:
        day, month = int(m.group(1)), MONTHS[m.group(2).lower()[:3]]
        span = m.span()
    else:
        m = NUMERIC_DATE.search(line)
        if not m:
            return None
        day, month = int(m.group(1)), int(m.group(2))
        span = m.span()
    if not (1 <= month <= 12 and 1 <= day <= 31):
        return None
    year = post_date.year
    if month < post_date.month - 6:
        year += 1
    elif month > post_date.month + 6:
        year -= 1
    try:
        return date(year, month, day), span
    except ValueError:
        return None


def strip_meta(line, date_span=None):
    if date_span:
        line = line[: date_span[0]] + " " + line[date_span[1]:]
    line = TIME.sub(" ", line)
    line = WEEKDAY_WORDS.sub(" ", line)
    line = re.sub(r"\b(OmHome( Space| Chiang Mai)?|Om Home|завтра|сегодня|в)\b", " ", line, flags=re.I)
    line = re.sub(r"^\W*[-—–]\s*", "", clean(line))
    return clean(line)


def category(title, description):
    text = f"{title} {description}".lower()
    for key, pattern in CATEGORIES:
        if re.search(pattern, title.lower()):
            return key
    # Film blurbs mention games, tea or yoga in passing, so the film check wins once the title gave no answer.
    if re.search(r"фильм|режисс|кино|мультфильм|комеди|драм|триллер|хоррор|франшиз|спилберг|a24", text):
        return "cinema"
    for key, pattern in CATEGORIES:
        if re.search(pattern, text):
            return key
    return "other"


def parse_post(post):
    post_date = date.fromisoformat(post["date"][:10])
    lines = [line.strip() for line in post["text"].split("\n")]
    events = []
    current_day = None
    pending = None  # event that still needs its title

    def start(day, hhmm, title, index):
        nonlocal pending
        event = {"date": day.isoformat(), "time": hhmm, "title": title, "desc": [], "line": index}
        events.append(event)
        pending = None if title else event
        return event

    for index, raw in enumerate(lines):
        if not raw or SEPARATOR.match(raw):
            continue
        found = find_date(raw, post_date)
        time_match = TIME.search(raw if not found else raw[: found[1][0]] + " " * (found[1][1] - found[1][0]) + raw[found[1][1]:])
        hhmm = f"{int(time_match.group(1)):02d}:{time_match.group(2)}" if time_match else None

        if found:
            current_day = found[0]
            rest = strip_meta(raw, found[1])
            if hhmm or rest:
                start(current_day, hhmm, rest if len(rest) >= 3 else None, index)
            else:
                pending = {"date": current_day.isoformat(), "time": None, "title": None, "desc": [], "line": index, "_header": True}
            continue

        if hhmm and current_day and re.match(r"^\W*\d{1,2}[:.]\d{2}", clean(raw) or raw.lstrip("🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛🕜🕝🕞🕟🕠🕡🕢🕣🕤🕥🕦🕧 ")):
            rest = strip_meta(raw)
            if pending and pending.get("_header") and not rest:
                pending["time"] = hhmm
                continue
            if pending and pending.get("_header"):
                pending = None
            start(current_day, hhmm, rest if len(rest) >= 3 else None, index)
            continue

        text = clean(raw)
        if not text or SERVICE.match(raw):
            if events and "@" in raw:
                handle = re.search(r"@([A-Za-z0-9_]{4,})", raw)
                if handle and "contact" not in events[-1]:
                    events[-1]["contact"] = "@" + handle.group(1)
            continue
        if pending and len(text) >= 3:
            if pending.get("_header"):
                pending.pop("_header")
                events.append(pending)
            pending["title"] = text
            pending = None
            continue
        if events and len(events[-1]["desc"]) < 3:
            events[-1]["desc"].append(text)

    result = []
    for event in events:
        if not event.get("title"):
            continue
        result.append(event)
    return result


def normalise_title(title):
    title = re.sub(r"^(кинопоказ( фильма)?|смотрим( мультфильм)?|киновечер|фильм|мультфильм|играем в|собираемся играть в)\s*[:—-]?\s*",
                   "", title, flags=re.I)
    if title.count("«") != title.count("»"):
        title = title.replace("«", "").replace("»", "")
    title = re.sub(r"^«([^»]+)»", r"\1", title)
    title = title.replace('"', "").replace("“", "").replace("”", "").strip(" ,.-—")
    return title[:1].upper() + title[1:]


def download(url, path):
    if path.exists():
        return True
    for attempt in range(4):
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30).read()
            break
        except OSError:
            time.sleep(2 ** attempt)
    else:
        return False
    from PIL import Image
    image = Image.open(io.BytesIO(data)).convert("RGB")
    image.thumbnail((640, 800))
    image.save(path, quality=78, optimize=True, progressive=True)
    return True


def main():
    posts = json.load(open(sys.argv[1]))
    overrides = json.load(open(Path(__file__).with_name("overrides.json")))
    by_id = {post["id"]: post for post in posts}
    OUT_PHOTOS.mkdir(parents=True, exist_ok=True)
    merged = {}
    extra = [(by_id[a["post"]], {**a, "desc": [], "manual": True}) for a in overrides["add"] if a["post"] in by_id]
    parsed = [(post, event) for post in posts for event in parse_post(post)]
    for post, event in parsed + extra:
            ref = f"{post['id']}:{event['date']}:{event['time']}"
            if ref in overrides["drop"]:
                continue
            title = overrides["titles"].get(ref) or (event["title"] if event.get("manual") else normalise_title(event["title"]))
            key = (event["date"], re.sub(r"[^а-яa-z]", "", title.lower())[:12])
            description = " ".join(event["desc"])
            if key in merged:
                if len(description) > len(merged[key]["description"]):
                    merged[key]["description"] = description
                continue
            merged[key] = {
                "date": event["date"],
                "time": event["time"],
                "title": title,
                "description": description[:420],
                "category": event.get("category") or overrides["categories"].get(ref) or category(title, description),
                "post": f"https://t.me/omhome_thai/{post['id']}",
                "photo": None,
                "_photos": post["photos"],
                **({"contact": event["contact"]} if event.get("contact") else {}),
            }

    events = sorted(merged.values(), key=lambda e: (e["date"], e["time"] or ""))
    for event in events:
        photos = event.pop("_photos")
        if photos:
            post_id = event["post"].rsplit("/", 1)[1]
            path = OUT_PHOTOS / f"{post_id}.jpg"
            if download(photos[0], path):
                event["photo"] = f"/archive/{post_id}.jpg"

    by_category = {}
    for event in events:
        by_category[event["category"]] = by_category.get(event["category"], 0) + 1
    archive = {
        "generatedAt": date.today().isoformat(),
        "source": "https://t.me/omhome_thai",
        "since": events[0]["date"] if events else None,
        "total": len(events),
        "byCategory": by_category,
        "events": events,
    }
    OUT_JSON.write_text(json.dumps(archive, ensure_ascii=False, indent=1) + "\n")
    print(f"{len(events)} events, {by_category}", file=sys.stderr)


if __name__ == "__main__":
    main()
