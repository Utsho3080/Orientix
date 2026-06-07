const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const migrate = async () => {
  try {
    console.log('Connecting to Neon Database for V3 migrations...');

    // 1. Clients Table Updates
    await pool.query(`
      ALTER TABLE clients 
      ADD COLUMN IF NOT EXISTS service VARCHAR(100),
      ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS pending_amount DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(10, 2)
    `);
    
    // Convert old "ONBOARDING" status to "Active" just to be clean
    await pool.query(`UPDATE clients SET status = 'Active' WHERE status = 'ONBOARDING'`);
    console.log('✅ Clients table updated with financial columns and status reset.');

    // 2. CMS Packages
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_packages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price VARCHAR(100),
        features TEXT,
        is_popular BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ CMS Packages table verified.');

    // 3. CMS Testimonials
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_testimonials (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_role VARCHAR(255),
        content TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ CMS Testimonials table verified.');

    // 4. Contact Messages
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'NEW',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contact Messages table verified.');

    console.log('Migration V3 completed successfully!');
  } catch (err) {
    console.error('Migration V3 failed:', err);
  } finally {
    pool.end();
  }
};

migrate();
