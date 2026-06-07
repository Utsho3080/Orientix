const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const db = require('../db');
const { verifyToken, requireAdmin, requireSuperAdmin } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const logAudit = async (userEmail, action, details) => {
  try {
    await db.query(
      'INSERT INTO audit_logs (user_email, action, details) VALUES ($1, $2, $3)',
      [userEmail || 'System', action, details]
    );
  } catch (err) {
    console.error('Audit log failure:', err);
  }
};

const findFlexibleValue = (row, possibleKeys) => {
  for (const k of Object.keys(row)) {
    const lowerK = k.toLowerCase().trim();
    if (possibleKeys.includes(lowerK)) return row[k];
  }
  for (const k of Object.keys(row)) {
    const lowerK = k.toLowerCase().trim();
    for (const pk of possibleKeys) {
      if (lowerK.includes(pk)) return row[k];
    }
  }
  return null;
};

const cleanLeadName = (name) => {
  if (!name || typeof name !== 'string') return 'Unknown Lead';
  let clean = name.split(/\s*(?:-|\||:)\s*/)[0].trim();
  clean = clean.split(/\s*(?:offers|treated\s+\d+|best\s+doctor|best\s+dermatologist|best\s+orthopedician|best\s+orthopedic|laser\s+hair|knee\s+replacement|joint\s+replacement|spine\s+surgeon).*/i)[0].trim();
  return clean || 'Unknown Lead';
};

// --- LEADS ---
router.get('/leads', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Server error fetching leads' }); }
});

router.post('/upload', verifyToken, requireSuperAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);
    let insertCount = 0;

    const uniqueRows = new Map();
    for (const row of rawData) {
      const rawName = findFlexibleValue(row, ['name', 'title', 'company', 'clinic', 'doctor', 'hospital', 'business']) || 'Unknown Lead';
      const cleanName = cleanLeadName(rawName);
      const email = findFlexibleValue(row, ['email', 'emails', 'e-mail']) || 'no-email';
      const phone = findFlexibleValue(row, ['phone', 'phones', 'mobile', 'tel', 'contact']) || 'no-phone';
      const uniqueKey = `${cleanName}-${phone}-${email}`;
      if (!uniqueRows.has(uniqueKey)) {
        uniqueRows.set(uniqueKey, { row, cleanName, email: email === 'no-email' ? null : email, phone: phone === 'no-phone' ? null : phone });
      }
    }

    for (const item of uniqueRows.values()) {
      const { row, cleanName, email, phone } = item;
      const outscraperData = JSON.stringify(row);
      let existing;
      if (cleanName !== 'Unknown Lead') {
        existing = await db.query(`SELECT id FROM leads WHERE name = $1 OR (email IS NOT NULL AND email = $2) OR (phone IS NOT NULL AND phone = $3)`, [cleanName, email, phone]);
      } else {
        existing = await db.query(`SELECT id FROM leads WHERE (email IS NOT NULL AND email = $1) OR (phone IS NOT NULL AND phone = $2)`, [email, phone]);
      }

      if (existing.rows.length === 0) {
        await db.query(`INSERT INTO leads (name, email, phone, outscraper_data) VALUES ($1, $2, $3, $4)`, [cleanName, email, phone, outscraperData]);
        insertCount++;
      }
    }
    await logAudit(req.user.email || 'Super Admin', 'UPLOAD_LEADS', `Imported ${insertCount} unique leads from file: ${req.file.originalname}`);
    res.json({ message: `Successfully imported ${insertCount} unique leads!`, count: insertCount });
  } catch (error) { res.status(500).json({ error: 'Failed to process Excel file' }); }
});

router.patch('/leads/:id', verifyToken, requireAdmin, async (req, res) => {
  const { status, remarks } = req.body;
  const userEmail = req.user.email || 'Admin';
  try {
    const leadRes = await db.query('SELECT name FROM leads WHERE id = $1', [req.params.id]);
    if (leadRes.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    const leadName = leadRes.rows[0].name;

    let queryArgs = [];
    let setClauses = [];
    let paramIndex = 1;

    if (status !== undefined) { setClauses.push(`status = $${paramIndex++}`); queryArgs.push(status); }
    if (remarks !== undefined) { setClauses.push(`remarks = $${paramIndex++}`); queryArgs.push(remarks); }
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
    setClauses.push(`last_updated_by = $${paramIndex++}`); queryArgs.push(userEmail);
    queryArgs.push(req.params.id);

    await db.query(`UPDATE leads SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`, queryArgs);

    let auditMsg = `Updated lead ID ${req.params.id} (${leadName}):`;
    if (status !== undefined) auditMsg += ` Status -> ${status}.`;
    if (remarks !== undefined) auditMsg += ` Remarks updated.`;
    await logAudit(userEmail, 'UPDATE_LEAD', auditMsg);

    res.json({ message: 'Update successful' });
  } catch (error) { res.status(500).json({ error: 'Database update failed' }); }
});

// --- CLIENT ONBOARDING ---
router.get('/clients', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Server error fetching clients' }); }
});

router.post('/clients', verifyToken, requireSuperAdmin, async (req, res) => {
  const { company_name, contact_name, email, phone, status, service, total_amount, pending_amount, paid_amount } = req.body;
  if (!company_name) return res.status(400).json({ error: 'Company Name is required' });
  try {
    const result = await db.query(
      `INSERT INTO clients (company_name, contact_name, email, phone, status, service, total_amount, pending_amount, paid_amount) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [company_name, contact_name, email, phone, status || 'Active', service || '', total_amount || 0, pending_amount || 0, paid_amount || 0]
    );
    await logAudit(req.user.email || 'Super Admin', 'CREATE_CLIENT', `Onboarded new client: ${company_name}`);
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'Server error creating client' }); }
});

router.put('/clients/:id', verifyToken, requireSuperAdmin, async (req, res) => {
  const { company_name, contact_name, email, phone, status, service, total_amount, pending_amount, paid_amount } = req.body;
  try {
    const result = await db.query(
      `UPDATE clients 
       SET company_name = $1, contact_name = $2, email = $3, phone = $4, status = $5, service = $6, total_amount = $7, pending_amount = $8, paid_amount = $9
       WHERE id = $10 RETURNING *`,
      [company_name, contact_name, email, phone, status, service, total_amount, pending_amount, paid_amount, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Client not found' });
    await logAudit(req.user.email || 'Super Admin', 'UPDATE_CLIENT', `Updated client ID ${req.params.id}: ${company_name} (Status: ${status})`);
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'Server error updating client' }); }
});

router.delete('/clients/:id', verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const clientRes = await db.query('SELECT company_name FROM clients WHERE id = $1', [req.params.id]);
    if (clientRes.rows.length === 0) return res.status(404).json({ error: 'Client not found' });
    await db.query('DELETE FROM clients WHERE id = $1', [req.params.id]);
    await logAudit(req.user.email || 'Super Admin', 'DELETE_CLIENT', `Deleted client ID ${req.params.id}`);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) { res.status(500).json({ error: 'Server error deleting client' }); }
});

// --- CMS SETTINGS ---
router.get('/cms', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cms_settings');
    const settings = {};
    result.rows.forEach(row => { settings[row.key] = row.value; });
    res.json(settings);
  } catch (error) { res.status(500).json({ error: 'Server error fetching CMS settings' }); }
});

router.post('/cms', verifyToken, requireSuperAdmin, async (req, res) => {
  const settings = req.body;
  try {
    for (const [key, value] of Object.entries(settings)) {
      await db.query(`INSERT INTO cms_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`, [key, value]);
    }
    await logAudit(req.user.email || 'Super Admin', 'UPDATE_CMS', `Updated CMS config keys`);
    res.json({ message: 'CMS settings updated successfully' });
  } catch (error) { res.status(500).json({ error: 'Server error updating CMS settings' }); }
});

// --- CMS PACKAGES ---
router.get('/cms/packages', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cms_packages ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Server error fetching packages' }); }
});

router.post('/cms/packages', verifyToken, requireSuperAdmin, async (req, res) => {
  const { name, price, features, is_popular } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO cms_packages (name, price, features, is_popular) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, features, is_popular || false]
    );
    await logAudit(req.user.email || 'Super Admin', 'CREATE_PACKAGE', `Created package ${name}`);
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'Server error creating package' }); }
});

router.delete('/cms/packages/:id', verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM cms_packages WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) { res.status(500).json({ error: 'Error deleting package' }); }
});

// --- CMS TESTIMONIALS ---
router.get('/cms/testimonials', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cms_testimonials ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Error fetching testimonials' }); }
});

router.post('/cms/testimonials', verifyToken, requireSuperAdmin, async (req, res) => {
  const { client_name, client_role, content, rating } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO cms_testimonials (client_name, client_role, content, rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [client_name, client_role, content, rating || 5]
    );
    await logAudit(req.user.email || 'Super Admin', 'CREATE_TESTIMONIAL', `Created testimonial for ${client_name}`);
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'Error creating testimonial' }); }
});

router.delete('/cms/testimonials/:id', verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM cms_testimonials WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) { res.status(500).json({ error: 'Error deleting testimonial' }); }
});

// --- CONTACT MESSAGES ---
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
  try {
    await db.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );
    res.json({ message: 'Message sent successfully' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/contact-messages', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// --- AUDIT LOGS ---
router.get('/audit', verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Server error fetching audit logs' }); }
});

module.exports = router;
