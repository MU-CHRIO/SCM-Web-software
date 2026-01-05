const express = require('express');
const db = require('../db');
const { getUserById, getCourseById } = require('../utils');

const router = express.Router();

// Get courses for a faculty
router.get('/faculty/:facultyId', async (req, res) => {
  const facultyId = req.params.facultyId;
  try {
    const faculty = await getUserById(facultyId);
    if (!faculty) return res.status(404).json({ error: 'faculty not found' });
    db.all('SELECT c.* FROM courses c JOIN course_faculty cf ON c.id = cf.course_id WHERE cf.faculty_id = ?', [facultyId], (err, rows) => {
      if (err) return res.status(500).json({ error: 'database error' });
      return res.json(rows);
    });
  } catch (err) {
    return res.status(500).json({ error: 'database error' });
  }
});

// Get courses for a student
router.get('/student/:studentId', async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const student = await getUserById(studentId);
    if (!student) return res.status(404).json({ error: 'student not found' });
    db.all('SELECT c.* FROM courses c JOIN course_students cs ON c.id = cs.course_id WHERE cs.student_id = ?', [studentId], (err, rows) => {
      if (err) return res.status(500).json({ error: 'database error' });
      return res.json(rows);
    });
  } catch (err) {
    return res.status(500).json({ error: 'database error' });
  }
});

module.exports = router;
