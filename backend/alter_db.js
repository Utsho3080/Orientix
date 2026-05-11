const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const alterDatabase = async () => {
  try {
    console.log('Connecting to Neon Database to add tracking columns...');
    
    await pool.query(`
      ALTER TABLE leads 
      ADD COLUMN IF NOT EXISTS remarks TEXT,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS last_updated_by VARCHAR(255)
    `);
    
    console.log('✅ Columns added successfully.');
  } catch (error) {
    console.error('Error altering database:', error);
  } finally {
    pool.end();
  }
};

alterDatabase();
