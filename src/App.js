import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Faculty from './pages/Faculty';
import Student from './pages/Student';
import Navbar from './components/Navbar';
import Clubs from './pages/Clubs';
import Events from './pages/Events';

function withNavbar(Component) {
  return (props) => (
    <>
      <Navbar />
      <div className="page-container">
        <Component {...props} />
      </div>
    </>
  );
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch (e) {
    return null;
  }
}

export default function App() {
  const [user, setUser] = React.useState(getUser());

  React.useEffect(() => {
    const onUserChange = () => setUser(getUser());
    window.addEventListener('user-changed', onUserChange);
    return () => window.removeEventListener('user-changed', onUserChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={user ? (user.role === 'admin' ? withNavbar(Admin)() : <Navigate to="/login" />) : <Navigate to="/login" />} />
        <Route path="/faculty" element={user ? (user.role === 'faculty' ? withNavbar(Faculty)() : <Navigate to="/login" />) : <Navigate to="/login" />} />
        <Route path="/student" element={user ? (user.role === 'student' ? withNavbar(Student)() : <Navigate to="/login" />) : <Navigate to="/login" />} />
        <Route path="/clubs" element={withNavbar(Clubs)()} />
        <Route path="/events" element={withNavbar(Events)()} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
