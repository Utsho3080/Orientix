const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const migrate = async () => {
  try {
    console.log('Connecting to Neon Database for V2 migrations...');

    // 1. Clients Table (Client Onboarding)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'ONBOARDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Clients table verified.');

    // 2. CMS Settings Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT
      )
    `);
    console.log('✅ CMS Settings table verified.');

    // Insert default CMS settings if empty
    const checkCms = await pool.query('SELECT count(*) FROM cms_settings');
    if (parseInt(checkCms.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO cms_settings (key, value) VALUES 
        ('hero_title', 'We Power Your Digital Vision'),
        ('hero_subtitle', 'High-performance websites, revenue-driving marketing & rock-solid maintenance — all under one roof to scale your brand fearlessly.'),
        ('contact_email', 'contact@orientix.com'),
        ('contact_phone', '+91 81007 30178')
      `);
      console.log('✅ Default CMS settings initialized.');
    }

    // 3. Audit Logs Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Audit Logs table verified.');

    console.log('Migration V2 completed successfully!');
  } catch (err) {
    console.error('Migration V2 failed:', err);
  } finally {
    pool.end();
  }
};

migrate();
