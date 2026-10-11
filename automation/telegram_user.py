"""Sends a poster from your own Telegram account (Telethon) to partners who repost announcements.

A bot cannot write to a person first, so partner reposts go from your account using the Telethon session
you already have for the guide project. The session file never leaves your computer.

    TG_API_ID=... TG_API_HASH=... TG_SESSION=~/path/to/guide.session \
      python3 automation/telegram_user.py poster1.jpg caption1.html [poster2.jpg caption2.html ...]

One greeting, then every poster of the week with its caption.

    python3 automation/telegram_user.py --pick-intro    # prints the next greeting (used for the approval preview)

Env:
    TG_API_ID, TG_API_HASH   — from my.telegram.org (the same as in the guide project)
    TG_SESSION               — path to the .session file (with or without the .session suffix)
    TG_PARTNERS              — comma-separated usernames, default: VeronikaKirpichenko
    TG_PARTNER_INTRO         — fixed first message instead of the rotating ones below
"""
import asyncio
import os
import random
import sys


# The first message changes from week to week so it never reads like a bot; the same one never goes twice in a row.
INTROS = [
    "Привет) вот анонс на грядущую неделю - буду благодарен за репост",
    "Привет! Делюсь анонсом на эту неделю — буду очень благодарен за репост 🙏",
    "Приветик) Свежая афиша OmHome на неделю, если будет возможность репостнуть — спасибо огромное!",
    "Привет-привет) Вот что у нас на неделе — буду рад, если поделишься у себя 🤍",
    "Привет! Принёс анонс на грядущую неделю) Буду благодарен за репост",
    "Хэй, привет) Афиша на неделю готова — если не сложно, репостни, пожалуйста 🙌",
    "Привет) Новая неделя — новые встречи. Буду благодарен, если поделишься анонсом!",
    "Привет! Вот наши события на неделю — спасибо, что помогаешь рассказать о них 🌿",
]
LAST_INTRO_FILE = os.path.expanduser("~/.omhome_partner_intro")


def pick_intro() -> str:
    if os.environ.get("TG_PARTNER_INTRO"):
        return os.environ["TG_PARTNER_INTRO"]
    try:
        last = open(LAST_INTRO_FILE, encoding="utf-8").read().strip()
    except OSError:
        last = ""
    intro = random.choice([text for text in INTROS if text != last])
    with open(LAST_INTRO_FILE, "w", encoding="utf-8") as f:
        f.write(intro)
    return intro


async def main(pairs: list[tuple[str, str]]) -> None:
    posts = [(poster, open(caption_path, encoding="utf-8").read()) for poster, caption_path in pairs]
    partners = [p.strip().lstrip("@") for p in os.environ.get("TG_PARTNERS", "VeronikaKirpichenko").split(",") if p.strip()]
    intro = pick_intro()
    session = os.path.expanduser(os.environ["TG_SESSION"]).removesuffix(".session")

    from telethon import TelegramClient

    async with TelegramClient(session, int(os.environ["TG_API_ID"]), os.environ["TG_API_HASH"]) as client:
        for partner in partners:
            await client.send_message(partner, intro)
            for poster, caption in posts:
                await client.send_file(partner, poster, caption=caption, parse_mode="html")
            print(f"✅ @{partner}: приветствие и {len(posts)} афиш(и)")


if __name__ == "__main__":
    args = sys.argv[1:]
    if args == ["--pick-intro"]:
        print(pick_intro())
        sys.exit(0)
    if not args or len(args) % 2:
        sys.exit(__doc__)
    asyncio.run(main(list(zip(args[::2], args[1::2]))))
