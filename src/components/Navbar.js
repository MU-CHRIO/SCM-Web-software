import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    let user = null;
    try { user = JSON.parse(localStorage.getItem('user')); } catch (e) { user = null; }

    const logout = () => {
        localStorage.removeItem('user');
        try { window.dispatchEvent(new Event('user-changed')); } catch (e) { /* ignore */ }
        navigate('/login');
    };

    return (
        <nav className="nav">
            <div className="nav-left">
                <div className="logo">Smart<span className="accent">Campus</span></div>
            </div>
            <div className="nav-center">
                <Link to="/events">Events</Link>
                <Link to="/clubs">Clubs</Link>
                {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
                {user && user.role === 'faculty' && <Link to="/faculty">Faculty</Link>}
                {user && user.role === 'student' && <Link to="/student">Student</Link>}
            </div>
            <div className="nav-right">
                {user ? (
                    <>
                        <div className="user-pill">{user.name} • {user.role}</div>
                        <button className="btn-ghost" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn-ghost">Login</Link>
                        <Link to="/register" className="btn-ghost">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}