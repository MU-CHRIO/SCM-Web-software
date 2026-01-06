import React, { useEffect, useState } from 'react';
import Card from '../components/Card';

export default function Student() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [courses, setCourses] = useState([]);
    const [attendance, setAttendance] = useState({});

    useEffect(() => {
        async function load() {
            if (!user) return;
            const { ok, data } = await import('../api').then(m => m.apiFetch(`/api/courses/student/${user.id}`));
            setCourses((ok && data) ? data : []);
        }
        load();
    }, []);

    const open = async (courseId) => {
        if (!user) return;
        const { ok, data } = await import('../api').then(m => m.apiFetch(`/api/attendance/student/${user.id}/${courseId}`));
        setAttendance((s) => ({ ...s, [courseId]: (ok && data) ? data : [] }));
    };

    return (
        <div className="stack">
            <div className="grid">
                {courses.map(c => (
                    <Card key={c.id} title={c.course_name} description={`Course ${c.id}`}>
                        <div className="stack">
                            <button className="btn-ghost" onClick={() => open(c.id)}>View Attendance</button>
                            {attendance[c.id] && (
                                <div className="attendance-list">
                                    {attendance[c.id].length === 0 && <div className="muted">No records</div>}
                                    {attendance[c.id].map(a => (
                                        <div className="attendance-row" key={a.id}>
                                            <div>{new Date(a.timestamp).toLocaleString()}</div>
                                            <div className={a.status === 'present' ? 'tag present' : 'tag absent'}>{a.status}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
            {courses.length === 0 && <Card title="No courses">You are not enrolled in any courses.</Card>}
        </div>
    );
}