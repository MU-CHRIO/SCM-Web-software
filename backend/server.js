const express = require('express');
const cors = require('cors');
const db = require('./db'); // initialize DB and tables

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const coursesRoutes = require('./routes/courses');
const attendanceRoutes = require('./routes/attendance');
const eventsRoutes = require('./routes/events');
const clubsRoutes = require('./routes/clubs');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/clubs', clubsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
