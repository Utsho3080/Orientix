const db = require('./db');

(async () => {
  try {
    await db.query(`ALTER TABLE todos ADD COLUMN remarks JSONB DEFAULT '[]'::jsonb`);
    console.log('Successfully added remarks column to todos table');
  } catch (err) {
    if (err.code === '42701') { // column already exists
      console.log('Column already exists, moving on.');
    } else {
      console.error('Error altering table:', err);
    }
  } finally {
    process.exit(0);
  }
})();
