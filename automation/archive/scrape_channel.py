"""Downloads every post of a public Telegram channel from its web preview (t.me/s/<channel>).

    python3 automation/archive/scrape_channel.py omhome_thai > channel.json

No login needed: the web preview is public. Output: JSON list of {id, date, text, html, photos, views}.
"""
import html
import json
import re
import sys
import time
import urllib.request

CHANNEL = sys.argv[1] if len(sys.argv) > 1 else "omhome_thai"
POST = re.compile(r'<div class="tgme_widget_message_wrap.*?(?=<div class="tgme_widget_message_wrap|\Z)', re.S)


def fetch(before=None, attempts=5):
    url = f"https://t.me/s/{CHANNEL}" + (f"?before={before}" if before else "")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    for attempt in range(attempts):
        try:
            return urllib.request.urlopen(req, timeout=30).read().decode("utf-8")
        except OSError:
            if attempt == attempts - 1:
                raise
            time.sleep(2 ** attempt)


def to_text(fragment):
    fragment = re.sub(r"<br\s*/?>", "\n", fragment)
    fragment = re.sub(r"<[^>]+>", "", fragment)
    return html.unescape(fragment).strip()


def parse(page):
    posts = []
    for block in POST.findall(page):
        pid = re.search(rf'data-post="{CHANNEL}/(\d+)"', block)
        if not pid:
            continue
        text = re.search(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', block, re.S)
        date = re.search(r'<time datetime="([^"]+)"', block)
        views = re.search(r'<span class="tgme_widget_message_views">([^<]+)</span>', block)
        photos = re.findall(r"tgme_widget_message_photo_wrap.*?background-image:url\('([^']+)'\)", block, re.S)
        posts.append({
            "id": int(pid.group(1)),
            "date": date.group(1) if date else None,
            "text": to_text(text.group(1)) if text else "",
            "html": text.group(1) if text else "",
            "photos": photos,
            "views": views.group(1) if views else None,
        })
    return posts


def main():
    seen, before = {}, None
    while True:
        posts = parse(fetch(before))
        new = [p for p in posts if p["id"] not in seen]
        if not new:
            break
        for p in new:
            seen[p["id"]] = p
        before = min(p["id"] for p in posts)
        print(f"… {len(seen)} posts, before={before}", file=sys.stderr)
        time.sleep(0.6)
    json.dump(sorted(seen.values(), key=lambda p: p["id"]), sys.stdout, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
