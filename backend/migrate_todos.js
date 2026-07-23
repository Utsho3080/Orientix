const db = require('./db');

async function migrate() {
  try {
    console.log('Creating todos table...');
    
    // Status can be: 'pending', 'completed', 'deleted'
    await db.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assigned_by INTEGER REFERENCES users(id),
        assigned_to INTEGER REFERENCES users(id),
        due_date TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Todos table created successfully.');
  } catch (error) {
    console.error('Error creating todos table:', error);
  } finally {
    process.exit();
  }
}

migrate();
