import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import FormInput from '../components/FormInput';

export default function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            console.debug('[Login] submit', { name });
            const { ok, data } = await import('../api').then(m => m.apiFetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password }) }));
            if (!ok) {
                console.warn('[Login] failed', data);
                return setError(data && data.error ? data.error : 'Login failed');
            }
            console.debug('[Login] success', data);
            // save minimal user info
            const user = { id: data.id, role: data.role, name };
            localStorage.setItem('user', JSON.stringify(user));
            // notify App that user changed so routes update
            try { window.dispatchEvent(new Event('user-changed')); } catch (e) { /* ignore */ }
            if (data.role === 'admin') navigate('/admin');
            else if (data.role === 'faculty') navigate('/faculty');
            else navigate('/student');
        } catch (err) {
            console.error('[Login] network error', err);
            setError('Network error');
        }
    };

    return (
        <div className="login-wrap">
            <Card title="Welcome back" description="Sign in to your Smart Campus account">
                <form className="login-form" onSubmit={submit}>
                    <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="your name" />
                    <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="●●●●●●" />
                    {error && <div className="error">{error}</div>}
                    <button className="btn-primary" type="submit">Sign in</button>
                    <div className="muted">New here? <a href="/register">Create an account</a></div>
                </form>
            </Card>
        </div>
    );
}