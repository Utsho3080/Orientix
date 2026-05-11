const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool to the Neon PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon requires SSL but rejectUnauthorized is usually false for testing/basic configs
  }
});

// Test the database connection automatically
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client for Neon Database', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to Neon PostgreSQL Database at:', result.rows[0].now);
  });
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
