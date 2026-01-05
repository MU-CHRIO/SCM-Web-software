const db = require('./db');

function isValidRole(role) {
  return ['admin', 'faculty', 'student'].includes(role);
}

function validateRequired(fields, body) {
  for (const f of fields) {
    if (body[f] === undefined || body[f] === null || body[f] === '') return `Field '${f}' is required`;
  }
  return null;
}

function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, name, role FROM users WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function getCourseById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, course_name FROM courses WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function getClubById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, name, description, created_by FROM clubs WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function getEventById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, title, description, club_id, start_time, end_time, location FROM events WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = { isValidRole, validateRequired, getUserById, getCourseById, getClubById, getEventById };
