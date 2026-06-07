const db = require('./db');

async function run() {
  try {
    await db.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash',
      ['founder.orientix@gmail.com', '2026@Technologies', 'SUPER_ADMIN']
    );
    console.log('User created');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
