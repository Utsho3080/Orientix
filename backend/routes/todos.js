const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.use(verifyToken);

// GET /api/todos - Fetch todos based on role
router.get('/', async (req, res) => {
  const { id, role } = req.user;
  try {
    let result;
    if (role === 'SUPER_ADMIN') {
      result = await db.query(`
        SELECT t.*, u1.name as assigned_by_name, u2.name as assigned_to_name, u3.name as deleted_by_name, u4.name as updated_by_name
        FROM todos t
        LEFT JOIN users u1 ON t.assigned_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        LEFT JOIN users u3 ON t.deleted_by = u3.id
        LEFT JOIN users u4 ON t.updated_by = u4.id
        ORDER BY t.due_date ASC
      `);
    } else {
      // Associate sees tasks they created OR tasks assigned to them
      result = await db.query(`
        SELECT t.*, u1.name as assigned_by_name, u2.name as assigned_to_name, u3.name as deleted_by_name, u4.name as updated_by_name
        FROM todos t
        LEFT JOIN users u1 ON t.assigned_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        LEFT JOIN users u3 ON t.deleted_by = u3.id
        LEFT JOIN users u4 ON t.updated_by = u4.id
        WHERE (t.assigned_by = $1 OR t.assigned_to = $1)
        ORDER BY t.due_date ASC
      `, [id]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  const { title, description, assigned_to, due_date, status, priority } = req.body;
  const assigned_by = req.user.id;
  try {
    const result = await db.query(
      `INSERT INTO todos (title, description, assigned_by, assigned_to, due_date, status, completed_at, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, assigned_by, assigned_to || assigned_by, due_date, status || 'pending', status === 'completed' ? (due_date || new Date().toISOString()) : null, priority || 'Medium']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/todos/:id - Update todo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, assigned_to, due_date, status, priority } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Check permission
    const checkResult = await db.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) return res.status(404).json({ error: 'Todo not found' });
    const todo = checkResult.rows[0];

    if (userRole !== 'SUPER_ADMIN' && todo.assigned_by !== userId && todo.assigned_to !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Only creator or SuperAdmin can change due_date and title for associate tasks
    // If you are assigned_to but not assigned_by, and not SuperAdmin, maybe you can only change status?
    // User requested: "due date or task name can be changeable who create the task for admin. but associate task can be changed by any admin."
    // We'll enforce this broadly:
    
    let updateTitle = todo.title;
    let updateDueDate = todo.due_date;
    let updateDescription = todo.description;
    let updateAssignedTo = todo.assigned_to;
    let updatePriority = todo.priority;
    
    if (userRole === 'SUPER_ADMIN' || todo.assigned_by === userId) {
      updateTitle = title !== undefined ? title : todo.title;
      updateDueDate = due_date !== undefined ? due_date : todo.due_date;
      updateDescription = description !== undefined ? description : todo.description;
      updateAssignedTo = assigned_to !== undefined ? assigned_to : todo.assigned_to;
      updatePriority = priority !== undefined ? priority : todo.priority;
    }

    const updateStatus = status !== undefined ? status : todo.status;
    let updateCompletedAt = todo.completed_at;

    if (updateStatus === 'completed' && todo.status !== 'completed') {
      updateCompletedAt = new Date().toISOString();
    } else if (updateStatus !== 'completed') {
      updateCompletedAt = null;
    }

    const result = await db.query(
      `UPDATE todos 
       SET title = $1, description = $2, assigned_to = $3, due_date = $4, status = $5, completed_at = $6, updated_at = CURRENT_TIMESTAMP, updated_by = $7, priority = $8
       WHERE id = $9 RETURNING *`,
      [updateTitle, updateDescription, updateAssignedTo, updateDueDate, updateStatus, updateCompletedAt, userId, updatePriority, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/todos/:id - Soft delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const checkResult = await db.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) return res.status(404).json({ error: 'Todo not found' });
    const todo = checkResult.rows[0];

    if (userRole !== 'SUPER_ADMIN' && todo.assigned_by !== userId) {
      return res.status(403).json({ error: 'Forbidden. Only creator or SuperAdmin can delete.' });
    }

    await db.query(`UPDATE todos SET status = 'deleted', deleted_by = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [userId, id]);
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/todos/:id/remarks - Add a remark to a task
router.post('/:id/remarks', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Remark text is required' });
  }

  try {
    const checkResult = await db.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) return res.status(404).json({ error: 'Todo not found' });
    const todo = checkResult.rows[0];

    // Only the assignee can add a remark
    if (todo.assigned_to !== userId) {
      return res.status(403).json({ error: 'Forbidden: Only the assignee can add remarks' });
    }

    const newRemark = {
      text,
      timestamp: new Date().toISOString(),
      user_id: userId
    };

    const existingRemarks = todo.remarks || [];
    existingRemarks.push(newRemark);

    const updateResult = await db.query(
      'UPDATE todos SET remarks = $1 WHERE id = $2 RETURNING *',
      [JSON.stringify(existingRemarks), id]
    );

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
