require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./db'); // Initializes Neon PG pool
const authRoutes = require('./routes/auth');
const crmRoutes = require('./routes/crm');

const app = express();
app.use(cors());
app.use(express.json());

// Public Routes
app.use('/api/auth', authRoutes);

// CRM Module Routes (Handles both Admin & SuperAdmin Walled Gardens)
app.use('/api/crm', crmRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend CRM Server securely running on port ${PORT}`);
});
