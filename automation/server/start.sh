#!/bin/sh
# Clones the repo (GITHUB_TOKEN, optional — fine-grained token with Contents: read/write on artartemev/OmHome) and starts
# the bot. Site updates are committed and pushed to main from this clone.
set -e
REPO=/app/repo
# Without GITHUB_TOKEN the (public) repo is still cloned and the bot works; only the site update can't be pushed.
if [ -n "$GITHUB_TOKEN" ]; then URL="https://x-access-token:${GITHUB_TOKEN}@github.com/artartemev/OmHome.git"
else URL="https://github.com/artartemev/OmHome.git"; echo "⚠️ GITHUB_TOKEN не задан — афиша на сайте обновляться не будет"; fi
if [ ! -d "$REPO/.git" ]; then git clone --depth 50 "$URL" "$REPO"; fi
cd "$REPO"
git config user.name "OmHome bot"
git config user.email "bot@omhome.space"
git fetch origin main && git checkout -B main origin/main
exec node automation/bot.mjs
