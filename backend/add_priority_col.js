const db = require('./db');

(async () => {
  try {
    await db.query(`ALTER TABLE todos ADD COLUMN priority VARCHAR(20) DEFAULT 'Medium'`);
    console.log('Successfully added priority column to todos table');
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
