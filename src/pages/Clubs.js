import React, { useEffect, useState } from 'react';
import Card from '../components/Card';

export default function Clubs() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [clubs, setClubs] = useState([]);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [msg, setMsg] = useState(null);
    const [members, setMembers] = useState({});

    useEffect(() => { load(); }, []);
    const load = async () => {
        const { ok, data } = await import('../api').then(m => m.apiFetch('/api/clubs'));
        const list = (ok && data) ? data : [];
        setClubs(list);
        // prefetch members for nicer UI state
        list.forEach(c => fetchMembers(c.id));
    };

    const isMember = (clubId) => {
        if (!user) return false;
        const ms = members[clubId];
        return ms && ms.some(m => m.user_id === user.id);
    };

    const create = async (e) => {
        e.preventDefault(); setMsg(null);
        if (!user) return setMsg('login required');
        try {
            const { ok, data } = await import('../api').then(m => m.apiFetch('/api/clubs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description: desc, created_by: user.id }) }));
            if (!ok) return setMsg(data && data.error ? data.error : 'Create failed');
            setName(''); setDesc(''); setMsg('Created'); load();
        } catch (err) { setMsg('Network error'); }
    };

    const join = async (id) => {
        if (!user) return setMsg('login required');
        const { ok, data } = await import('../api').then(m => m.apiFetch(`/api/clubs/${id}/join`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id }) }));
        if (!ok) return setMsg(data && data.error ? data.error : 'Join failed');
        setMsg('Joined'); fetchMembers(id);
    };

    const fetchMembers = async (id) => {
        const { ok, data } = await import('../api').then(m => m.apiFetch(`/api/clubs/${id}/members`));
        setMembers(s => ({ ...s, [id]: (ok && data) ? data : [] }));
    };

    return (
        <div className="stack">
            <div className="grid">
                {clubs.map(c => (
                    <Card key={c.id} title={c.name} description={c.description}>
                        <div className="stack">
                            <div className="muted">Created by: {c.created_by}</div>
                            <div>
                                <button className="btn-ghost" onClick={() => fetchMembers(c.id)}>View Members</button>
                                <button className="btn-primary" disabled={isMember(c.id)} onClick={() => join(c.id)}>{isMember(c.id) ? 'Joined' : 'Join'}</button>
                            </div>
                            {members[c.id] && (
                                <div className="muted">
                                    {members[c.id].map(m => (<div key={m.user_id}>{m.name} <span className="tag">{m.role}</span></div>))}
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {user && (user.role === 'admin' || user.role === 'faculty') ? (
                <Card title="Create a Club">
                    <form className="login-form" onSubmit={create}>
                        <label className="form-group"><span className="form-label">Name</span><input className="form-input" value={name} onChange={(e) => setName(e.target.value)} /></label>
                        <label className="form-group"><span className="form-label">Description</span><input className="form-input" value={desc} onChange={(e) => setDesc(e.target.value)} /></label>
                        {msg && <div className="muted">{msg}</div>}
                        <button className="btn-primary" type="submit">Create</button>
                    </form>
                </Card>
            ) : (
                <Card title="Create a Club">
                    <div className="muted">Only faculty or admin can create clubs.</div>
                </Card>
            )}
        </div>
    );
}