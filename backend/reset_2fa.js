const db = require('./db');

async function run() {
  try {
    await db.query('UPDATE users SET totp_secret = NULL WHERE email = $1', ['founder.orientix@gmail.com']);
    console.log('2FA secret reset successfully.');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
