const db = require('./db');

async function fix() {
  try {
    await db.query("ALTER TABLE todos ALTER COLUMN due_date TYPE TIMESTAMPTZ USING due_date AT TIME ZONE 'UTC'");
    await db.query("ALTER TABLE todos ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'");
    await db.query("ALTER TABLE todos ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC'");
    await db.query("ALTER TABLE todos ALTER COLUMN completed_at TYPE TIMESTAMPTZ USING completed_at AT TIME ZONE 'UTC'");
    console.log('Database timezone fix applied successfully!');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

fix();
