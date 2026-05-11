const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const db = require('../db');
const { verifyToken, requireAdmin, requireSuperAdmin } = require('../middleware/auth');

// Configure Multer for in-memory file parsing
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 1. GET ALL LEADS (Available to Admins & SuperAdmins)
router.get('/leads', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Server error fetching leads' });
  }
});

// 2. UPLOAD EXCEL FILE (Available ONLY to SuperAdmins)
router.post('/upload', verifyToken, requireSuperAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Read the Excel buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert sheet to JSON array
    const rawData = xlsx.utils.sheet_to_json(sheet);
    let insertCount = 0;

    // Deduplicate the raw data in memory to prevent double-uploading the same file
    const uniqueRows = new Map();
    for (const row of rawData) {
      const name = row['Name'] || row['name'] || row['title'] || row['Title'] || row['Company'] || 'Unknown Lead';
      const email = row['Email'] || row['email'] || row['Emails'] || 'no-email';
      const phone = row['Phone'] || row['phone'] || row['Phones'] || 'no-phone';
      
      const uniqueKey = `${name}-${phone}-${email}`;
      if (!uniqueRows.has(uniqueKey)) {
        uniqueRows.set(uniqueKey, row);
      }
    }

    // Loop and insert into Neon Database
    for (const row of uniqueRows.values()) {
      // Standardize common Outscraper columns with exact case tolerance
      const name = row['Name'] || row['name'] || row['Title'] || row['title'] || row['Company'] || 'Unknown Lead';
      const email = row['Email'] || row['email'] || row['Emails'] || null;
      const phone = row['Phone'] || row['phone'] || row['Phones'] || null;
      
      // Store all the extra columns directly into the JSONB field safely
      const outscraperData = JSON.stringify(row);

      // Check for DB-level duplicates (Matching strictly on Name string to aggressively block duplicates)
      const existing = await db.query('SELECT id FROM leads WHERE name = $1', [name]);
      if (existing.rows.length === 0) {
        await db.query(
          `INSERT INTO leads (name, email, phone, outscraper_data) VALUES ($1, $2, $3, $4)`,
          [name, email, phone, outscraperData]
        );
        insertCount++;
      }
    }

    res.json({ message: `Successfully imported ${insertCount} unique leads!`, count: insertCount });

  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
});

// 3. SECURE UNIFIED PATCH ENDPOINT (Handles Status & Remarks Updates with Audit Logging)
router.patch('/leads/:id', verifyToken, requireAdmin, async (req, res) => {
  const { status, remarks } = req.body;
  const userEmail = req.user.email || 'Admin';
  
  try {
    // We dynamically build the query depending on what frontend sent us
    let queryArgs = [];
    let setClauses = [];
    let paramIndex = 1;

    if (status !== undefined) {
      setClauses.push(`status = $${paramIndex++}`);
      queryArgs.push(status);
    }
    if (remarks !== undefined) {
      setClauses.push(`remarks = $${paramIndex++}`);
      queryArgs.push(remarks);
    }

    // Always update Audit Trail explicitly
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
    setClauses.push(`last_updated_by = $${paramIndex++}`);
    queryArgs.push(userEmail);

    // Finally append the ID
    queryArgs.push(req.params.id);

    const sqlStr = `UPDATE leads SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`;
    
    await db.query(sqlStr, queryArgs);
    res.json({ message: 'Update successful' });
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ error: 'Database update failed' });
  }
});

module.exports = router;
