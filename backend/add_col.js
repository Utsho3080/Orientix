const db = require('./db');

async function fix() {
  try {
    await db.query("ALTER TABLE todos ADD COLUMN deleted_by INTEGER REFERENCES users(id)");
    console.log('Added deleted_by column');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

fix();
