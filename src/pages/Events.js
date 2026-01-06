import React, { useEffect, useState } from 'react';
import Card from '../components/Card';

export default function Events() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [clubId, setClubId] = useState('');
    const [start, setStart] = useState('');
    const [location, setLocation] = useState('');
    const [msg, setMsg] = useState(null);
    const [participants, setParticipants] = useState({});
    const [clubs, setClubs] = useState([]);

    useEffect(() => { load(); loadClubs(); }, []);
    const load = async () => {
        const { ok, data } = await import('../api').then(m => m.apiFetch('/api/events'));
        const list = (ok && data) ? data : [];
        setEvents(list);
        list.forEach(ev => fetchParticipants(ev.id));
    };
    const loadClubs = async () => {
        const { ok, data } = await import('../api').then(m => m.apiFetch('/api/clubs'));
        setClubs((ok && data) ? data : []);
    };

    const isParticipant = (eventId) => {
        if (!user) return false;
        const ps = participants[eventId];
        return ps && ps.some(p => p.user_id === user.id);
    };

    const create = async (e) => {
        e.preventDefault(); setMsg(null);
        if (!user) return setMsg('login required');
        try {
            const body = { title, description: desc, club_id: clubId || null, created_by: user.id, start_time: start || null, location: location || null };
            const { ok, data } = await import('../api').then(m => m.apiFetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }));
            if (!ok) return setMsg(data && data.error ? data.error : 'Create failed');
            setTitle(''); setDesc(''); setClubId(''); setStart(''); setLocation(''); setMsg('Created'); load();
        } catch (err) { setMsg('Network error'); }
    };

    const join = async (id) => {
        if (!user) return setMsg('login required');
        const { ok, data } = await import('../api').then(m => m.apiFetch(`/api/events/${id}/join`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id }) }));
        if (!ok) return setMsg(data && data.error ? data.error : 'Join failed');
        setMsg('Joined'); fetchParticipants(id);
    };

    const fetchParticipants = async (id) => {
        const { ok, data } = await import('../api').then(m => m.apiFetch(`/api/events/${id}/participants`));
        setParticipants(s => ({ ...s, [id]: (ok && data) ? data : [] }));
    };

    return (
        <div className="stack">
            <div className="grid">
                {events.map(ev => (
                    <Card key={ev.id} title={ev.title} description={ev.description}>
                        <div className="stack">
                            <div className="muted">When: {ev.start_time || 'TBA'}</div>
                            <div>Location: {ev.location || 'TBA'}</div>
                            <div>
                                <button className="btn-ghost" onClick={() => fetchParticipants(ev.id)}>Participants</button>
                                <button className="btn-primary" disabled={isParticipant(ev.id)} onClick={() => join(ev.id)}>{isParticipant(ev.id) ? 'Joined' : 'Join'}</button>
                            </div>
                            {participants[ev.id] && (
                                <div className="muted">
                                    {participants[ev.id].map(p => (<div key={p.user_id}>{p.name} <span className="tag">{p.status}</span></div>))}
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            <Card title="Create an Event">
                <form className="login-form" onSubmit={create}>
                    <label className="form-group"><span className="form-label">Title</span><input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
                    <label className="form-group"><span className="form-label">Description</span><input className="form-input" value={desc} onChange={(e) => setDesc(e.target.value)} /></label>
                    <label className="form-group"><span className="form-label">Club (optional)</span>
                        <select className="form-input" value={clubId} onChange={(e) => setClubId(e.target.value)}>
                            <option value="">-- none --</option>
                            {clubs.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                        </select>
                    </label>
                    <label className="form-group"><span className="form-label">Start</span><input className="form-input" value={start} onChange={(e) => setStart(e.target.value)} placeholder="YYYY-MM-DDTHH:MM:SS" /></label>
                    <label className="form-group"><span className="form-label">Location</span><input className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} /></label>
                    {msg && <div className="muted">{msg}</div>}
                    <button className="btn-primary" type="submit">Create</button>
                </form>
            </Card>
        </div>
    );
}