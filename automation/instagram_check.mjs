// Checks the Instagram token without publishing anything:
//   set -a; . ./.env; set +a; node automation/instagram_check.mjs
// Prints the account the token belongs to, its type, and the token expiry.

const token = process.env.IG_ACCESS_TOKEN;
if (!token) {
  console.error('IG_ACCESS_TOKEN не задан в .env');
  process.exit(1);
}

const me = await fetch(
  `https://graph.instagram.com/v21.0/me?fields=user_id,username,account_type,media_count&access_token=${token}`
).then((r) => r.json());
if (me.error) {
  console.error(`❌ Токен не принят: ${me.error.message}`);
  process.exit(1);
}
console.log(`✅ @${me.username} · ${me.account_type} · постов: ${me.media_count}`);
console.log(`   user_id: ${me.user_id}${process.env.IG_USER_ID && process.env.IG_USER_ID !== String(me.user_id) ? `  ⚠️ в .env IG_USER_ID=${process.env.IG_USER_ID}` : ''}`);
if (!/BUSINESS|MEDIA_CREATOR|CREATOR/.test(me.account_type ?? '')) {
  console.log('⚠️ Публиковать через API могут только профессиональные аккаунты (Бизнес или Автор).');
}
