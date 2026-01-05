const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const { isValidRole, validateRequired } = require('../utils');

const router = express.Router();
const SALT_ROUNDS = 10;

// Register
router.post('/register', (req, res) => {
  const { name, password, role } = req.body;
  const missing = validateRequired(['name', 'password', 'role'], req.body);
  if (missing) return res.status(400).json({ error: missing });
  if (!isValidRole(role)) return res.status(400).json({ error: 'invalid role; must be one of admin, faculty, student' });
  if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ error: 'password must be at least 6 characters' });

  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    if (err) return res.status(500).json({ error: 'hash error' });
    const sql = 'INSERT INTO users (name, password, role) VALUES (?,?,?)';
    db.run(sql, [name, hash, role], function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') return res.status(409).json({ error: 'user already exists' });
        return res.status(500).json({ error: 'database error' });
      }
      return res.status(201).json({ id: this.lastID, name, role });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { name, password } = req.body;
  const missing = validateRequired(['name', 'password'], req.body);
  if (missing) return res.status(400).json({ error: missing });

  db.get('SELECT id, name, password, role FROM users WHERE name = ?', [name], (err, row) => {
    if (err) return res.status(500).json({ error: 'database error' });
    if (!row) return res.status(401).json({ error: 'invalid credentials' });

    bcrypt.compare(password, row.password, (err, match) => {
      if (err) return res.status(500).json({ error: 'hash error' });
      if (!match) return res.status(401).json({ error: 'invalid credentials' });
      return res.json({ id: row.id, role: row.role });
    });
  });
});

module.exports = router;
