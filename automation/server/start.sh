#!/bin/sh
# Clones the repo (GITHUB_TOKEN — fine-grained token with Contents: read/write on artartemev/OmHome) and starts
# the bot. Site updates are committed and pushed to main from this clone.
set -e
REPO=/app/repo
if [ ! -d "$REPO/.git" ]; then
  git clone --depth 50 "https://x-access-token:${GITHUB_TOKEN}@github.com/artartemev/OmHome.git" "$REPO"
fi
cd "$REPO"
git config user.name "OmHome bot"
git config user.email "bot@omhome.space"
git fetch origin main && git checkout -B main origin/main
exec node automation/bot.mjs
