const express = require('express');
const db = require('../db');
const { validateRequired, getUserById, getCourseById } = require('../utils');

const router = express.Router();

// Create a course
router.post('/courses', (req, res) => {
  const { course_name } = req.body;
  const missing = validateRequired(['course_name'], req.body);
  if (missing) return res.status(400).json({ error: missing });

  db.run('INSERT INTO courses (course_name) VALUES (?)', [course_name], function (err) {
    if (err) return res.status(500).json({ error: 'database error' });
    return res.status(201).json({ id: this.lastID, course_name });
  });
});

// Assign faculty to a course
router.post('/assign/faculty', async (req, res) => {
  const { course_id, faculty_id } = req.body;
  const missing = validateRequired(['course_id', 'faculty_id'], req.body);
  if (missing) return res.status(400).json({ error: missing });

  try {
    const course = await getCourseById(course_id);
    if (!course) return res.status(404).json({ error: 'course not found' });
    const faculty = await getUserById(faculty_id);
    if (!faculty) return res.status(404).json({ error: 'faculty not found' });
    if (faculty.role !== 'faculty') return res.status(400).json({ error: 'user is not a faculty' });

    db.run('INSERT INTO course_faculty (course_id, faculty_id) VALUES (?,?)', [course_id, faculty_id], function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') return res.status(400).json({ error: 'invalid course or faculty or already assigned' });
        return res.status(500).json({ error: 'database error' });
      }
      return res.status(201).json({ course_id, faculty_id });
    });
  } catch (err) {
    return res.status(500).json({ error: 'database error' });
  }
});

// Assign student to a course
router.post('/assign/student', async (req, res) => {
  const { course_id, student_id } = req.body;
  const missing = validateRequired(['course_id', 'student_id'], req.body);
  if (missing) return res.status(400).json({ error: missing });

  try {
    const course = await getCourseById(course_id);
    if (!course) return res.status(404).json({ error: 'course not found' });
    const student = await getUserById(student_id);
    if (!student) return res.status(404).json({ error: 'student not found' });
    if (student.role !== 'student') return res.status(400).json({ error: 'user is not a student' });

    db.run('INSERT INTO course_students (course_id, student_id) VALUES (?,?)', [course_id, student_id], function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') return res.status(400).json({ error: 'invalid course or student or already assigned' });
        return res.status(500).json({ error: 'database error' });
      }
      return res.status(201).json({ course_id, student_id });
    });
  } catch (err) {
    return res.status(500).json({ error: 'database error' });
  }
});

module.exports = router;
