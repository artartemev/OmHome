"""Sends posters from your own Telegram account (Telethon): to partners who repost announcements, and to chats
where the bot cannot be added (e.g. «Волшебный чат»).

A bot cannot write to a person first or post in a chat it is not a member of, so these go from your account using
the Telethon session you already have for the guide project. The session file never leaves your computer.

    TG_API_ID=... TG_API_HASH=... TG_SESSION=~/path/to/guide.session \
      python3 automation/telegram_user.py poster1.jpg caption1.html [poster2.jpg caption2.html ...]

One greeting, then every poster of the week with its caption.

    python3 automation/telegram_user.py --pick-intro    # prints the next greeting (used for the approval preview)
    python3 automation/telegram_user.py --chats poster.jpg caption.html   # poster to TG_USER_REPOST_CHATS, no greeting
    python3 automation/telegram_user.py --digest user:VeronikaKirpichenko text.html poster1.jpg poster2.jpg …
    python3 automation/telegram_user.py --digest chat:https://t.me/+invite text.html poster1.jpg …
        # the whole schedule in one message: an album of posters with its own text (to a partner — after a greeting)

Env:
    TG_API_ID, TG_API_HASH   — from my.telegram.org (the same as in the guide project)
    TG_SESSION               — path to the .session file (with or without the .session suffix)
    TG_SESSION_STRING        — or the session as a string (server; see automation/server/make_session.py)
    TG_PARTNERS              — comma-separated usernames, default: VeronikaKirpichenko
    TG_PARTNER_INTRO         — fixed first message instead of the rotating ones below
    TG_USER_REPOST_CHATS     — chats for --chats: "invite-link=Name,…" (you must be a member)
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
    session = user_session()

    from telethon import TelegramClient

    async with TelegramClient(session, int(os.environ["TG_API_ID"]), os.environ["TG_API_HASH"]) as client:
        for partner in partners:
            await client.send_message(partner, intro)
            for poster, caption in posts:
                await client.send_file(partner, poster, caption=caption, parse_mode="html")
            print(f"✅ @{partner}: приветствие и {len(posts)} афиш(и)")


def user_session():
    """TG_SESSION_STRING (server: a StringSession) or TG_SESSION (Mac: path to the .session file)."""
    if os.environ.get("TG_SESSION_STRING"):
        from telethon.sessions import StringSession

        return StringSession(os.environ["TG_SESSION_STRING"])
    return os.path.expanduser(os.environ["TG_SESSION"]).removesuffix(".session")


def user_chats():
    chats = []
    for entry in os.environ.get("TG_USER_REPOST_CHATS", "").split(","):
        if entry.strip():
            link, _, name = entry.strip().partition("=")
            chats.append((link.strip(), name.strip() or link.strip()))
    return chats


async def post_to_chats(pairs: list[tuple[str, str]]) -> None:
    posts = [(poster, open(caption_path, encoding="utf-8").read()) for poster, caption_path in pairs]
    session = user_session()

    from telethon import TelegramClient

    async with TelegramClient(session, int(os.environ["TG_API_ID"]), os.environ["TG_API_HASH"]) as client:
        for link, name in user_chats():
            chat = await client.get_entity(link)
            for poster, caption in posts:
                await client.send_file(chat, poster, caption=caption, parse_mode="html")
            print(f"✅ «{name}»: {len(posts)} афиш(и)")


CAPTION_LIMIT = 1024  # Telegram media caption limit


async def send_digest(target: str, text_path: str, posters: list[str]) -> None:
    """One message with the whole schedule: an album of posters captioned with the text written for this audience.
    A text longer than a caption goes right after the album. A partner (user:…) first gets a greeting."""
    text = open(text_path, encoding="utf-8").read()
    kind, _, address = target.partition(":")

    from telethon import TelegramClient

    async with TelegramClient(user_session(), int(os.environ["TG_API_ID"]), os.environ["TG_API_HASH"]) as client:
        peer = await client.get_entity(address.lstrip("@"))
        if kind == "user":
            await client.send_message(peer, pick_intro())
        if len(text) <= CAPTION_LIMIT:
            await client.send_file(peer, posters, caption=text, parse_mode="html")
        else:
            await client.send_file(peer, posters)
            await client.send_message(peer, text, parse_mode="html", link_preview=False)
        print(f"✅ {address}: {len(posters)} афиш(и) и текст")


if __name__ == "__main__":
    args = sys.argv[1:]
    if args[:1] == ["--digest"]:
        if len(args) < 4:
            sys.exit(__doc__)
        asyncio.run(send_digest(args[1], args[2], args[3:]))
        sys.exit(0)
    if args[:1] == ["--chats"]:
        rest = args[1:]
        if not rest or len(rest) % 2:
            sys.exit(__doc__)
        asyncio.run(post_to_chats(list(zip(rest[::2], rest[1::2]))))
        sys.exit(0)
    if args == ["--pick-intro"]:
        print(pick_intro())
        sys.exit(0)
    if not args or len(args) % 2:
        sys.exit(__doc__)
    asyncio.run(main(list(zip(args[::2], args[1::2]))))
