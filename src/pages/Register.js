import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import FormInput from '../components/FormInput';

export default function Register() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!name || !password || !role) return setError('All fields are required');
        if (password.length < 6) return setError('Password must be at least 6 characters');

        try {
            console.debug('[Register] submit', { name, role });
            const { ok, data } = await import('../api').then(m => m.apiFetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password, role }) }));
            if (!ok) {
                console.warn('[Register] failed', data);
                return setError(data && data.error ? data.error : 'Registration failed');
            }

            console.debug('[Register] success', data);
            // auto-login: save user and redirect
            const user = { id: data.id, role: data.role, name };
            localStorage.setItem('user', JSON.stringify(user));
            // notify App that user changed
            try { window.dispatchEvent(new Event('user-changed')); } catch (e) { /* ignore */ }
            if (data.role === 'admin') navigate('/admin');
            else if (data.role === 'faculty') navigate('/faculty');
            else navigate('/student');
        } catch (err) {
            console.error('[Register] network error', err);
            setError('Network error');
        }
    };

    return (
        <div className="login-wrap">
            <Card title="Create an account" description="Register for Smart Campus">
                <form className="login-form" onSubmit={submit}>
                    <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="your name" />
                    <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="●●●●●●" />
                    <label className="form-group">
                        <span className="form-label">Role</span>
                        <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="admin">Admin</option>
                        </select>
                    </label>
                    {error && <div className="error">{error}</div>}
                    <button className="btn-primary" type="submit">Register</button>
                    <div className="muted">Already have an account? <Link to="/login">Sign in</Link></div>
                </form>
            </Card>
        </div>
    );
}