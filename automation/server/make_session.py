"""Creates a separate Telethon session for the server and prints it as a string (TG_SESSION_STRING).

Run on your Mac: python3 automation/server/make_session.py — Telegram sends a login code to your app.
A separate session (not the guide one) is safer: the same session used from two places at once can be revoked.
"""
import os

from telethon.sessions import StringSession
from telethon.sync import TelegramClient

api_id = int(os.environ.get("TG_API_ID") or input("TG_API_ID: "))
api_hash = os.environ.get("TG_API_HASH") or input("TG_API_HASH: ")
with TelegramClient(StringSession(), api_id, api_hash, device_model="OmHome bot server") as client:
    print("\nTG_SESSION_STRING (храните как пароль, не публикуйте):\n")
    print(client.session.save())
