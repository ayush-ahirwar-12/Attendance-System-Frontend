'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ChevronRight, Search, Users,
  CheckCircle2, Clock, XCircle, BarChart3,
  Download, ScanFace, QrCode,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RosterStudent {
  _id: string;
  name: string;
  email: string;
  initials: string;
  rollNo: string;
  overallAttendance: number; // % across all lectures
}

// ─── Sample data: mirrors GET /api/teacher/classes/:classId/students ──────────
const META: Record<string, { section: string; courseName: string; courseCode: string; room: string; schedule: string; totalLectures: number }> = {
  'cls-1a': { section: 'A', courseName: 'Algorithm Design',   courseCode: 'CS301', room: 'Room 201', schedule: 'Mon / Wed / Fri  09:00–10:00', totalLectures: 18 },
  'cls-1b': { section: 'B', courseName: 'Algorithm Design',   courseCode: 'CS301', room: 'Room 105', schedule: 'Tue / Thu  11:00–12:30',        totalLectures: 12 },
  'cls-2a': { section: 'A', courseName: 'Data Structures',    courseCode: 'CS205', room: 'Room 301', schedule: 'Mon / Wed  08:00–09:30',         totalLectures: 14 },
  'cls-2b': { section: 'B', courseName: 'Data Structures',    courseCode: 'CS205', room: 'Lab 404',  schedule: 'Tue / Thu / Fri  13:00–14:00',   totalLectures: 20 },
  'cls-2c': { section: 'C', courseName: 'Data Structures',    courseCode: 'CS205', room: 'Room 202', schedule: 'Mon / Fri  15:00–16:30',          totalLectures: 10 },
  'cls-3a': { section: 'A', courseName: 'Machine Learning',   courseCode: 'CS401', room: 'Lab 301',  schedule: 'Wed / Fri  14:00–15:30',          totalLectures: 9  },
  'cls-4a': { section: 'A', courseName: 'Python Programming', courseCode: 'CS102', room: 'Room 101', schedule: 'Mon / Tue / Thu  10:00–11:00',    totalLectures: 22 },
  'cls-4b': { section: 'C', courseName: 'Python Programming', courseCode: 'CS102', room: 'Room 103', schedule: 'Wed / Fri  09:00–10:30',           totalLectures: 15 },
  'cls-5a': { section: 'A', courseName: 'Computer Networks',  courseCode: 'CS303', room: 'Room 204', schedule: 'Mon / Wed  11:00–12:30',          totalLectures: 8  },
  'cls-5b': { section: 'B', courseName: 'Computer Networks',  courseCode: 'CS303', room: 'Room 205', schedule: 'Tue / Thu  14:00–15:30',          totalLectures: 8  },
  'cls-6a': { section: 'A', courseName: 'Deep Learning',      courseCode: 'CS502', room: 'Lab 502',  schedule: 'Tue / Thu  16:00–17:30',          totalLectures: 6  },
};

const BASE_STUDENTS: RosterStudent[] = [
  { _id: 's1',  name: 'Aarav Sharma',  email: 'aarav@attendai.edu',  initials: 'AS', rollNo: 'CS21001', overallAttendance: 96 },
  { _id: 's2',  name: 'Priya Singh',   email: 'priya@attendai.edu',  initials: 'PS', rollNo: 'CS21002', overallAttendance: 88 },
  { _id: 's3',  name: 'Rahul Verma',   email: 'rahul@attendai.edu',  initials: 'RV', rollNo: 'CS21003', overallAttendance: 72 },
  { _id: 's4',  name: 'Ananya Patel',  email: 'ananya@attendai.edu', initials: 'AP', rollNo: 'CS21004', overallAttendance: 100},
  { _id: 's5',  name: 'Vikram Kumar',  email: 'vikram@attendai.edu', initials: 'VK', rollNo: 'CS21005', overallAttendance: 91 },
  { _id: 's6',  name: 'Sneha Reddy',   email: 'sneha@attendai.edu',  initials: 'SR', rollNo: 'CS21006', overallAttendance: 65 },
  { _id: 's7',  name: 'Arjun Nair',    email: 'arjun@attendai.edu',  initials: 'AN', rollNo: 'CS21007', overallAttendance: 83 },
  { _id: 's8',  name: 'Meera Iyer',    email: 'meera@attendai.edu',  initials: 'MI', rollNo: 'CS21008', overallAttendance: 95 },
  { _id: 's9',  name: 'Rohan Gupta',   email: 'rohan@attendai.edu',  initials: 'RG', rollNo: 'CS21009', overallAttendance: 89 },
  { _id: 's10', name: 'Kavya Menon',   email: 'kavya@attendai.edu',  initials: 'KM', rollNo: 'CS21010', overallAttendance: 58 },
  { _id: 's11', name: 'Aditya Roy',    email: 'aditya@attendai.edu', initials: 'AR', rollNo: 'CS21011', overallAttendance: 77 },
  { _id: 's12', name: 'Nisha Bose',    email: 'nisha@attendai.edu',  initials: 'NB', rollNo: 'CS21012', overallAttendance: 82 },
];

// Each class has a subset of students
const STUDENTS_BY_CLASS: Record<string, string[]> = {
  'cls-1a': ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10'],
  'cls-1b': ['s3','s5','s7','s9','s11','s12','s2','s6'],
  'cls-2a': ['s1','s4','s6','s8','s10','s11','s12'],
  'cls-2b': ['s2','s3','s5','s7','s9','s10','s12'],
  'cls-2c': ['s1','s2','s4','s6','s8','s11'],
  'cls-3a': BASE_STUDENTS.map(s => s._id),
  'cls-4a': ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','s12'],
  'cls-4b': ['s1','s3','s5','s7','s9','s11'],
  'cls-5a': ['s2','s4','s6','s8','s10','s12','s1','s3','s5','s7'],
  'cls-5b': ['s1','s4','s7','s10','s2','s5','s8','s11','s3','s6'],
  'cls-6a': ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','s12'],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const attColor = (p: number) => p >= 85 ? '#68fadd' : p >= 70 ? '#ff9800' : '#ff716c';
const attGrad  = (p: number) =>
  p >= 85 ? 'linear-gradient(90deg,#56ebcf,#68fadd)'
  : p >= 70 ? 'linear-gradient(90deg,#ff9800,#ffb74d)'
  : 'linear-gradient(90deg,#ff716c,#ff928c)';

const AttBadge = ({ pct }: { pct: number }) => {
  if (pct >= 85) return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(104,250,221,0.12)] text-[#68fadd]"><CheckCircle2 size={10} /> Good</span>;
  if (pct >= 70) return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(255,152,0,0.12)] text-[#ff9800]"><Clock size={10} /> Average</span>;
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(255,113,108,0.12)] text-[#ff716c]"><XCircle size={10} /> At Risk</span>;
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ClassRosterPage() {
  const params  = useParams<{ courseId: string; classId: string }>();
  const router  = useRouter();
  const { courseId, classId } = params;

  const meta     = META[classId] ?? { section: '?', courseName: 'Unknown', courseCode: '—', room: '—', schedule: '—', totalLectures: 0 };
  const ids      = STUDENTS_BY_CLASS[classId] ?? [];
  const students = BASE_STUDENTS.filter(s => ids.includes(s._id));

  const [search, setSearch] = useState('');
  const filtered = students.filter(
    s => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const avgAtt = students.length
    ? Math.round(students.reduce((a, s) => a + s.overallAttendance, 0) / students.length)
    : 0;
  const atRisk = students.filter(s => s.overallAttendance < 70).length;

  return (
    <div>
      {/* ── Breadcrumb ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-[#aba9b9] mb-6 flex-wrap">
        <Link href="/teacher/courses" className="flex items-center gap-1 hover:text-[#b6a0ff] transition-colors">
          <ArrowLeft size={13} /> My Courses
        </Link>
        <ChevronRight size={13} className="opacity-40" />
        <Link href={`/teacher/courses/${courseId}`} className="hover:text-[#b6a0ff] transition-colors">
          {meta.courseCode} – {meta.courseName}
        </Link>
        <ChevronRight size={13} className="opacity-40" />
        <span className="text-[#e9e6f7] font-medium">Section {meta.section} Roster</span>
      </div>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-7 gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[rgba(104,250,221,0.1)] text-[#68fadd] border border-[rgba(104,250,221,0.2)] mb-3">
            <Users size={11} /> Section {meta.section}
          </div>
          <h1 className="text-[26px] font-bold text-[#e9e6f7] tracking-tight">
            {meta.courseName} – Section {meta.section}
          </h1>
          <p className="text-sm text-[#aba9b9] mt-1">
            {meta.room} &nbsp;·&nbsp; {meta.schedule} &nbsp;·&nbsp; {meta.totalLectures} lectures conducted
          </p>
        </div>

        {/* ── Take Attendance CTA ──── */}
        <button
          onClick={() => router.push('/teacher/qr-generator')}
          className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-[#003830] bg-gradient-to-r from-[#68fadd] to-[#56ebcf] hover:-translate-y-px hover:shadow-[0_10px_30px_rgba(104,250,221,0.3)] transition-all shrink-0"
        >
          <ScanFace size={16} />
          Take Attendance
        </button>
      </div>

      {/* ── Stats row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Total Students', value: students.length,      color: '#b6a0ff', icon: <Users size={17} /> },
          { label: 'Avg Attendance', value: `${avgAtt}%`,         color: '#68fadd', icon: <BarChart3 size={17} /> },
          { label: 'At-Risk (<70%)', value: atRisk,               color: '#ff716c', icon: <XCircle size={17} /> },
        ].map(s => (
          <div key={s.label} className="relative overflow-hidden bg-[#181826] rounded-xl p-5">
            <div className="absolute inset-0 opacity-[0.06] rounded-xl" style={{ background: `radial-gradient(ellipse at top left, ${s.color}, transparent)` }} />
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20`, color: s.color }}>
                {s.icon}
              </div>
              <span className="text-[11px] text-[#aba9b9] font-medium">{s.label}</span>
            </div>
            <div className="text-[28px] font-bold text-[#e9e6f7]">{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Search + export ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9b9] pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or roll no…"
            className="w-full bg-[#181826] border border-[rgba(71,71,84,0.35)] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:border-[rgba(182,160,255,0.3)] transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#e9e6f7] border border-[rgba(71,71,84,0.35)] hover:bg-[#1e1e2d] transition-colors">
          <Download size={14} /> Export CSV
        </button>
        <button
          onClick={() => router.push('/teacher/qr-generator')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#b6a0ff] bg-[rgba(182,160,255,0.1)] border border-[rgba(182,160,255,0.2)] hover:bg-[rgba(182,160,255,0.15)] transition-colors"
        >
          <QrCode size={14} /> Generate QR
        </button>
      </div>

      {/* ── Roster table ─────────────────────────────────────────────── */}
      <div className="bg-[#181826] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="text-sm font-semibold text-[#e9e6f7]">Student Roster</div>
          <div className="text-xs text-[#aba9b9]">{filtered.length} of {students.length} shown</div>
        </div>

        <table className="w-full border-separate border-spacing-y-1">
          <thead>
            <tr>
              {['#', 'Student', 'Roll No', 'Email', 'Attendance %', 'Standing', 'Actions'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9] px-3 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s._id} className="bg-[#12121e] hover:bg-[#1e1e2d] transition-colors cursor-pointer">
                <td className="px-3 py-3 text-xs text-[#aba9b9] rounded-l-lg w-8">{i + 1}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7e51ff] to-[#56ebcf] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                      {s.initials}
                    </div>
                    <span className="text-sm font-medium text-[#e9e6f7]">{s.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="font-mono text-xs text-[#aba9b9] bg-[#242434] px-2 py-1 rounded">{s.rollNo}</span>
                </td>
                <td className="px-3 py-3 text-[12px] text-[#aba9b9]">{s.email}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <div className="flex-1 h-1.5 bg-[#242434] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.overallAttendance}%`, background: attGrad(s.overallAttendance) }} />
                    </div>
                    <span className="text-xs font-bold min-w-[32px] text-right" style={{ color: attColor(s.overallAttendance) }}>
                      {s.overallAttendance}%
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3"><AttBadge pct={s.overallAttendance} /></td>
                <td className="px-3 py-3 rounded-r-lg">
                  <button
                    onClick={() => router.push('/teacher/qr-generator')}
                    className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#68fadd] to-[#56ebcf] text-[#003830] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(104,250,221,0.2)] transition-all"
                  >
                    <ScanFace size={12} /> Attend
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[#aba9b9] text-sm">
                  No students match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
