const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const runMigration = async () => {
  try {
    console.log('Migrating expenses table for holdings & partner investments...');
    await pool.query(`
      ALTER TABLE expenses 
      ADD COLUMN IF NOT EXISTS holding_account VARCHAR(50) DEFAULT 'Bank',
      ADD COLUMN IF NOT EXISTS partner VARCHAR(50);
    `);
    console.log('✅ Added holding_account and partner columns successfully.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    pool.end();
  }
};

runMigration();
