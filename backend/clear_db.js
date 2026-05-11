const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const clearLeads = async () => {
  try {
    await pool.query('TRUNCATE TABLE leads RESTART IDENTITY CASCADE');
    console.log('✅ Leads table cleared & ID sequence reset successfully!');
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
};

clearLeads();
