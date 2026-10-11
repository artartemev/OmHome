# Always-on OmHome bot (Railway or any Docker host). The image holds only the tools; the code is cloned from GitHub
# at start and pulled before every announcement, so pushes to main reach the bot without a redeploy.
#   cd automation/server && railway up
FROM mcr.microsoft.com/playwright:v1.56.1-noble

RUN npm install -g playwright@1.56.1 \
 && apt-get update && apt-get install -y --no-install-recommends git python3-pip \
 && pip3 install --break-system-packages telethon \
 && rm -rf /var/lib/apt/lists/*

COPY start.sh /start.sh
RUN chmod +x /start.sh
ENV BOT_SYNC_GIT=1
CMD ["/start.sh"]
