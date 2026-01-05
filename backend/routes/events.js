const express = require('express');
const db = require('../db');
const { validateRequired, getEventById, getUserById, getClubById } = require('../utils');

const router = express.Router();

// Create event (admin or faculty)
router.post('/', async (req, res) => {
  const { title, description, club_id, created_by, start_time, end_time, location } = req.body;
  const missing = validateRequired(['title', 'created_by'], req.body);
  if (missing) return res.status(400).json({ error: missing });

  try {
    const creator = await getUserById(created_by);
    if (!creator) return res.status(404).json({ error: 'creator not found' });
    if (!['admin', 'faculty'].includes(creator.role)) return res.status(403).json({ error: 'only admin or faculty can create events' });
    if (club_id) {
      const club = await getClubById(club_id);
      if (!club) return res.status(404).json({ error: 'club not found' });
    }

    const sql = `INSERT INTO events (title, description, club_id, created_by, start_time, end_time, location) VALUES (?,?,?,?,?,?,?)`;
    db.run(sql, [title, description || null, club_id || null, created_by, start_time || null, end_time || null, location || null], function (err) {
      if (err) return res.status(500).json({ error: 'database error' });
      return res.status(201).json({ id: this.lastID, title, description, club_id, created_by, start_time, end_time, location });
    });
  } catch (err) {
    return res.status(500).json({ error: 'database error' });
  }
});

// List events (optional ?club_id=)
router.get('/', (req, res) => {
  const clubId = req.query.club_id;
  const params = clubId ? [clubId] : [];
  const sql = clubId ? 'SELECT * FROM events WHERE club_id = ? ORDER BY start_time ASC' : 'SELECT * FROM events ORDER BY start_time ASC';
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'database error' });
    return res.json(rows);
  });
});

// Join event
router.post('/:id/join', async (req, res) => {
  const { id } = req.params;
  const { user_id, status } = req.body;
  const missing = validateRequired(['user_id'], req.body);
  if (missing) return res.status(400).json({ error: missing });

  try {
    const ev = await getEventById(id);
    if (!ev) return res.status(404).json({ error: 'event not found' });
    const user = await getUserById(user_id);
    if (!user) return res.status(404).json({ error: 'user not found' });

    // check duplicate
    db.get('SELECT * FROM event_participants WHERE event_id = ? AND user_id = ?', [id, user_id], (err, row) => {
      if (err) return res.status(500).json({ error: 'database error' });
      if (row) return res.status(400).json({ error: 'already joined' });

      db.run('INSERT INTO event_participants (event_id, user_id, status) VALUES (?,?,?)', [id, user_id, status || 'going'], function (err2) {
        if (err2) return res.status(500).json({ error: 'database error' });
        return res.status(201).json({ event_id: Number(id), user_id, status: status || 'going' });
      });
    });
  } catch (err) {
    return res.status(500).json({ error: 'database error' });
  }
});

// Event participants list
router.get('/:id/participants', (req, res) => {
  const { id } = req.params;
  db.all('SELECT ep.event_id, ep.user_id, ep.status, ep.joined_at, u.name FROM event_participants ep JOIN users u ON u.id = ep.user_id WHERE event_id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'database error' });
    return res.json(rows);
  });
});

module.exports = router;
