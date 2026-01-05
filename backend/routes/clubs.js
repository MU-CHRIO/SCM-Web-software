const express = require('express');
const db = require('../db');
const { validateRequired, getUserById, getClubById } = require('../utils');

const router = express.Router();

// Create club (admin or faculty)
router.post('/', async (req, res) => {
  const { name, description, created_by } = req.body;
  const missing = validateRequired(['name', 'created_by'], req.body);
  if (missing) return res.status(400).json({ error: missing });

  try {
    const creator = await getUserById(created_by);
    if (!creator) return res.status(404).json({ error: 'creator not found' });
    if (!['admin', 'faculty'].includes(creator.role)) return res.status(403).json({ error: 'only admin or faculty can create clubs' });

    db.run('INSERT INTO clubs (name, description, created_by) VALUES (?,?,?)', [name, description || null, created_by], function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') return res.status(409).json({ error: 'club already exists' });
        return res.status(500).json({ error: 'database error' });
      }
      // add creator as club admin
      db.run('INSERT INTO club_members (club_id, user_id, role) VALUES (?,?,?)', [this.lastID, created_by, 'admin'], (err2) => {
        if (err2) console.error('failed to add creator as member', err2);
        return res.status(201).json({ id: this.lastID, name, description, created_by });
      });
    });
  } catch (err) {
    return res.status(500).json({ error: 'database error' });
  }
});

// List clubs
router.get('/', (req, res) => {
  db.all('SELECT id, name, description, created_by, created_at FROM clubs ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'database error' });
    return res.json(rows);
  });
});

// Join club
router.post('/:id/join', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  const missing = validateRequired(['user_id'], req.body);
  if (missing) return res.status(400).json({ error: missing });

  try {
    const club = await getClubById(id);
    if (!club) return res.status(404).json({ error: 'club not found' });
    const user = await getUserById(user_id);
    if (!user) return res.status(404).json({ error: 'user not found' });

    // Prevent duplicate joins with clear message
    db.get('SELECT * FROM club_members WHERE club_id = ? AND user_id = ?', [id, user_id], (err, row) => {
      if (err) return res.status(500).json({ error: 'database error' });
      if (row) return res.status(400).json({ error: 'already a member' });

      db.run('INSERT INTO club_members (club_id, user_id, role) VALUES (?,?,?)', [id, user_id, 'member'], function (err2) {
        if (err2) {
          return res.status(500).json({ error: 'database error' });
        }
        return res.status(201).json({ club_id: Number(id), user_id });
      });
    });
  } catch (err) {
    return res.status(500).json({ error: 'database error' });
  }
});

// List members
router.get('/:id/members', (req, res) => {
  const { id } = req.params;
  db.all('SELECT cm.club_id, cm.user_id, cm.role, cm.joined_at, u.name FROM club_members cm JOIN users u ON u.id = cm.user_id WHERE cm.club_id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'database error' });
    return res.json(rows);
  });
});

module.exports = router;
