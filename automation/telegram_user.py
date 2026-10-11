"""Sends a poster from your own Telegram account (Telethon) to partners who repost announcements.

A bot cannot write to a person first, so partner reposts go from your account using the Telethon session
you already have for the guide project. The session file never leaves your computer.

    TG_API_ID=... TG_API_HASH=... TG_SESSION=~/path/to/guide.session \
      python3 automation/telegram_user.py public/posters/2026-10-17-kirtan.jpg caption.html

Env:
    TG_API_ID, TG_API_HASH   — from my.telegram.org (the same as in the guide project)
    TG_SESSION               — path to the .session file (with or without the .session suffix)
    TG_PARTNERS              — comma-separated usernames, default: VeronikaKirpichenko
    TG_PARTNER_INTRO         — first message, default below
"""
import asyncio
import os
import sys

from telethon import TelegramClient

DEFAULT_INTRO = "Привет) вот анонс на грядущую неделю - буду благодарен за репост"


async def main(poster: str, caption_path: str) -> None:
    caption = open(caption_path, encoding="utf-8").read()
    partners = [p.strip().lstrip("@") for p in os.environ.get("TG_PARTNERS", "VeronikaKirpichenko").split(",") if p.strip()]
    intro = os.environ.get("TG_PARTNER_INTRO", DEFAULT_INTRO)
    session = os.path.expanduser(os.environ["TG_SESSION"]).removesuffix(".session")

    async with TelegramClient(session, int(os.environ["TG_API_ID"]), os.environ["TG_API_HASH"]) as client:
        for partner in partners:
            await client.send_message(partner, intro)
            await client.send_file(partner, poster, caption=caption, parse_mode="html")
            print(f"✅ отправлено @{partner}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    asyncio.run(main(sys.argv[1], sys.argv[2]))
