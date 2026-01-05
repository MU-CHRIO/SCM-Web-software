const express = require('express');
const db = require('../db');
const { validateRequired, getCourseById, getUserById } = require('../utils');

const router = express.Router();

// Mark attendance (faculty action)
router.post('/mark', async (req, res) => {
  const { course_id, student_id, status } = req.body;
  const missing = validateRequired(['course_id', 'student_id', 'status'], req.body);
  if (missing) return res.status(400).json({ error: missing });
  if (!['present', 'absent'].includes(status)) return res.status(400).json({ error: 'status must be present or absent' });

  try {
    const course = await getCourseById(course_id);
    if (!course) return res.status(404).json({ error: 'course not found' });
    const student = await getUserById(student_id);
    if (!student) return res.status(404).json({ error: 'student not found' });

    db.run('INSERT INTO attendance (course_id, student_id, status) VALUES (?,?,?)', [course_id, student_id, status], function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') return res.status(400).json({ error: 'invalid course or student' });
        return res.status(500).json({ error: 'database error' });
      }
      return res.status(201).json({ id: this.lastID, course_id, student_id, status });
    });
  } catch (err) {
    return res.status(500).json({ error: 'database error' });
  }
});

// Student views attendance for a course
router.get('/student/:studentId/:courseId', (req, res) => {
  const { studentId, courseId } = req.params;
  db.all('SELECT id, course_id, student_id, status, timestamp FROM attendance WHERE student_id = ? AND course_id = ? ORDER BY timestamp DESC', [studentId, courseId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    return res.json(rows);
  });
});

module.exports = router;
