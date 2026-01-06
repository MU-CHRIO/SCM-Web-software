import React, { useState } from 'react';
import Card from '../components/Card';
import FormInput from '../components/FormInput';

export default function Admin() {
    const [courseName, setCourseName] = useState('');
    const [courseMsg, setCourseMsg] = useState(null);

    const [aCourseId, setACourseId] = useState('');
    const [facultyId, setFacultyId] = useState('');
    const [assignMsg, setAssignMsg] = useState(null);

    const [sCourseId, setSCourseId] = useState('');
    const [studentId, setStudentId] = useState('');
    const [assignSMsg, setAssignSMsg] = useState(null);

    const createCourse = async (e) => {
        e.preventDefault(); setCourseMsg(null);
        try {
            const { ok, data } = await import('../api').then(m => m.apiFetch('/api/admin/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ course_name: courseName }) }));
            if (!ok) setCourseMsg(data && data.error ? data.error : 'Error'); else { setCourseMsg('Course created'); setCourseName(''); }
        } catch (err) { setCourseMsg('Network error'); }
    };

    const assignFaculty = async (e) => {
        e.preventDefault(); setAssignMsg(null);
        try {
            const { ok, data } = await import('../api').then(m => m.apiFetch('/api/admin/assign/faculty', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ course_id: Number(aCourseId), faculty_id: Number(facultyId) }) }));
            if (!ok) setAssignMsg(data && data.error ? data.error : 'Error'); else { setAssignMsg('Assigned'); setACourseId(''); setFacultyId(''); }
        } catch (err) { setAssignMsg('Network error'); }
    };

    const assignStudent = async (e) => {
        e.preventDefault(); setAssignSMsg(null);
        try {
            const { ok, data } = await import('../api').then(m => m.apiFetch('/api/admin/assign/student', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ course_id: Number(sCourseId), student_id: Number(studentId) }) }));
            if (!ok) setAssignSMsg(data && data.error ? data.error : 'Error'); else { setAssignSMsg('Assigned'); setSCourseId(''); setStudentId(''); }
        } catch (err) { setAssignSMsg('Network error'); }
    };

    return (
        <div className="grid">
            <Card title="Create Course">
                <form onSubmit={createCourse} className="stack">
                    <FormInput label="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                    <button className="btn-primary" type="submit">Create</button>
                    {courseMsg && <div className="muted">{courseMsg}</div>}
                </form>
            </Card>

            <Card title="Assign Course to Faculty">
                <form onSubmit={assignFaculty} className="stack">
                    <FormInput label="Course ID" value={aCourseId} onChange={(e) => setACourseId(e.target.value)} />
                    <FormInput label="Faculty ID" value={facultyId} onChange={(e) => setFacultyId(e.target.value)} />
                    <button className="btn-primary" type="submit">Assign Faculty</button>
                    {assignMsg && <div className="muted">{assignMsg}</div>}
                </form>
            </Card>

            <Card title="Assign Course to Student">
                <form onSubmit={assignStudent} className="stack">
                    <FormInput label="Course ID" value={sCourseId} onChange={(e) => setSCourseId(e.target.value)} />
                    <FormInput label="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                    <button className="btn-primary" type="submit">Assign Student</button>
                    {assignSMsg && <div className="muted">{assignSMsg}</div>}
                </form>
            </Card>
        </div>
    );
}