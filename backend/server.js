require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./db'); // Initializes Neon PG pool
const authRoutes = require('./routes/auth');
const crmRoutes = require('./routes/crm');
const todosRoutes = require('./routes/todos');

const app = express();
app.use(cors());
app.use(express.json());

// Health check routes
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Orientix Backend API is running' }));
app.get('/api', (req, res) => res.json({ status: 'ok', message: 'Orientix API endpoints ready' }));

// Public Routes
app.use('/api/auth', authRoutes);

// CRM Module Routes (Handles both Admin & SuperAdmin Walled Gardens)
app.use('/api/crm', crmRoutes);

// Todos Module Routes
app.use('/api/todos', todosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend CRM Server securely running on port ${PORT}`);
});
