const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const initializeDatabase = async () => {
  try {
    console.log('Connecting to Neon Database to initialize schema...');
    
    // 1. Users Table (RBAC)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
        totp_secret VARCHAR(255)
      )
    `);
    console.log('✅ Users table created.');

    // 2. Leads Table (JSONB column to handle varying Excel formats)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'NEW',
        outscraper_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Leads table created with JSONB support.');

    // 3. Insert default Super Admin (for testing)
    const checkAdmin = await pool.query("SELECT * FROM users WHERE email = 'admin@orientix.com'");
    if (checkAdmin.rows.length === 0) {
      // Note: password is 'password', in production this must be bcrypt hashed!
      await pool.query(`
        INSERT INTO users (email, password_hash, role) 
        VALUES ('admin@orientix.com', 'dummy_hash_for_now', 'SUPER_ADMIN')
      `);
      console.log('✅ Default Super Admin inserted (admin@orientix.com).');
    }

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    pool.end();
  }
};

initializeDatabase();
