const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file stored in the backend folder
const dbPath = path.resolve(__dirname, 'smart_campus.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open SQLite database:', err);
    process.exit(1);
  }
});

// Enable foreign key constraints
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON;');

  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('admin','faculty','student')) NOT NULL
  );`, (err) => {
    if (err) console.error('Error creating users table:', err);
  });

  // Courses table
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT
  );`, (err) => {
    if (err) console.error('Error creating courses table:', err);
  });

  // course_faculty mapping table
  db.run(`CREATE TABLE IF NOT EXISTS course_faculty (
    course_id INTEGER,
    faculty_id INTEGER,
    PRIMARY KEY (course_id, faculty_id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE
  );`, (err) => {
    if (err) console.error('Error creating course_faculty table:', err);
  });

  // course_students mapping table
  db.run(`CREATE TABLE IF NOT EXISTS course_students (
    course_id INTEGER,
    student_id INTEGER,
    PRIMARY KEY (course_id, student_id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
  );`, (err) => {
    if (err) console.error('Error creating course_students table:', err);
  });

  // Attendance table
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    student_id INTEGER,
    status TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
  );`, (err) => {
    if (err) console.error('Error creating attendance table:', err);
  });

  // Clubs table
  db.run(`CREATE TABLE IF NOT EXISTS clubs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
  );`, (err) => {
    if (err) console.error('Error creating clubs table:', err);
  });

  // Club memberships
  db.run(`CREATE TABLE IF NOT EXISTS club_members (
    club_id INTEGER,
    user_id INTEGER,
    role TEXT DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (club_id, user_id),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`, (err) => {
    if (err) console.error('Error creating club_members table:', err);
  });

  // Events table (can be linked to a club or standalone)
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    club_id INTEGER,
    created_by INTEGER,
    start_time DATETIME,
    end_time DATETIME,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
  );`, (err) => {
    if (err) console.error('Error creating events table:', err);
  });

  // Event participants
  db.run(`CREATE TABLE IF NOT EXISTS event_participants (
    event_id INTEGER,
    user_id INTEGER,
    status TEXT DEFAULT 'going',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`, (err) => {
    if (err) console.error('Error creating event_participants table:', err);
  });
});

// Export the database connection
module.exports = db;
