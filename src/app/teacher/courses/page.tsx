"use client";
export const dynamic = "force-dynamic";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, Search, ChevronRight, Users, Layers,
  TrendingUp, Clock, BarChart3, Star,
} from 'lucide-react';

// ─── Sample data (mirrors GET /api/teacher/courses response) ──────────────────
interface TeacherCourse {
  _id: string;
  code: string;
  name: string;
  classCount: number;
  studentCount: number;
  avgAttendance: number;
  lastSession: string;
  trend: 'up' | 'down' | 'neutral';
  className: string;
  tags: string[];
}

const SAMPLE_COURSES: TeacherCourse[] = [
  {
    _id: 'course-1',
    code: 'CS301',
    name: 'Algorithm Design',
    classCount: 2,
    studentCount: 38,
    avgAttendance: 92,
    lastSession: '2 hours ago',
    trend: 'up',
    className: 'CS Year 3 – Section A',
    tags: ['Core', 'Theory'],
  },
  {
    _id: 'course-2',
    code: 'CS205',
    name: 'Data Structures',
    classCount: 3,
    studentCount: 42,
    avgAttendance: 84,
    lastSession: 'Yesterday',
    trend: 'up',
    className: 'CS Year 2 – Section B',
    tags: ['Core', 'Lab'],
  },
  {
    _id: 'course-3',
    code: 'CS401',
    name: 'Machine Learning',
    classCount: 1,
    studentCount: 35,
    avgAttendance: 70,
    lastSession: '3 days ago',
    trend: 'down',
    className: 'CS Year 4 – Section A',
    tags: ['Elective', 'AI'],
  },
  {
    _id: 'course-4',
    code: 'CS102',
    name: 'Python Programming',
    classCount: 2,
    studentCount: 50,
    avgAttendance: 88,
    lastSession: 'Today',
    trend: 'neutral',
    className: 'CS Year 1 – Section C',
    tags: ['Core', 'Programming'],
  },
  {
    _id: 'course-5',
    code: 'CS303',
    name: 'Computer Networks',
    classCount: 2,
    studentCount: 40,
    avgAttendance: 76,
    lastSession: '4 days ago',
    trend: 'down',
    className: 'CS Year 3 – Section B',
    tags: ['Core', 'Networking'],
  },
  {
    _id: 'course-6',
    code: 'CS502',
    name: 'Deep Learning',
    classCount: 1,
    studentCount: 22,
    avgAttendance: 95,
    lastSession: '1 day ago',
    trend: 'up',
    className: 'CS Year 5 – Section A',
    tags: ['Elective', 'AI', 'Research'],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const AttendancePill = ({ pct }: { pct: number }) => {
  const color = pct >= 85 ? '#68fadd' : pct >= 70 ? '#ff9800' : '#ff716c';
  const bg = pct >= 85
    ? 'rgba(104,250,221,0.12)'
    : pct >= 70 ? 'rgba(255,152,0,0.12)' : 'rgba(255,113,108,0.12)';
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ color, backgroundColor: bg }}
    >
      <BarChart3 size={10} /> {pct}% avg
    </span>
  );
};

const TrendBadge = ({ trend }: { trend: 'up' | 'down' | 'neutral' }) => {
  if (trend === 'up')
    return <span className="text-[#68fadd] text-[11px] font-semibold flex items-center gap-1"><TrendingUp size={11} />Improving</span>;
  if (trend === 'down')
    return <span className="text-[#ff716c] text-[11px] font-semibold flex items-center gap-1"><TrendingUp size={11} className="rotate-180" />Declining</span>;
  return <span className="text-[#aba9b9] text-[11px] font-semibold">Stable</span>;
};

const Tag = ({ label }: { label: string }) => (
  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[rgba(182,160,255,0.1)] text-[#b6a0ff] border border-[rgba(182,160,255,0.15)]">
    {label}
  </span>
);

export default function MyCoursesPage() {
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_COURSES.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const totalStudents = SAMPLE_COURSES.reduce((a, c) => a + c.studentCount, 0);
  const avgAtt = Math.round(
    SAMPLE_COURSES.reduce((a, c) => a + c.avgAttendance, 0) / SAMPLE_COURSES.length,
  );

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight leading-tight">
            My Courses
          </h1>
          <p className="text-sm text-[#aba9b9] mt-1">
            Browse your assigned courses, drill into classes &amp; rosters.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[#aba9b9] bg-[#181826] px-4 py-2 rounded-full border border-[rgba(71,71,84,0.3)]">
          <BookOpen size={14} /> {SAMPLE_COURSES.length} courses assigned
        </div>
      </div>

      {/* ── Summary stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Total Courses',   value: SAMPLE_COURSES.length, color: '#b6a0ff', icon: <BookOpen size={18} /> },
          { label: 'Total Students',  value: totalStudents,          color: '#68fadd', icon: <Users size={18} /> },
          { label: 'Avg Attendance',  value: `${avgAtt}%`,           color: '#818cf8', icon: <BarChart3 size={18} /> },
        ].map(s => (
          <div key={s.label} className="relative overflow-hidden bg-[#181826] rounded-xl p-5 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="absolute inset-0 opacity-[0.06] rounded-xl" style={{ background: `radial-gradient(ellipse at top left, ${s.color}, transparent)` }} />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>
                {s.icon}
              </div>
              <span className="text-xs text-[#aba9b9] font-medium">{s.label}</span>
            </div>
            <div className="text-[32px] font-bold text-[#e9e6f7] tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9b9] pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search courses by name or code…"
          className="w-full bg-[#181826] border border-[rgba(71,71,84,0.35)] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:border-[rgba(182,160,255,0.3)] focus:bg-[#1e1e2d] transition-all"
        />
      </div>

      {/* ── Course grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
        {filtered.map(course => {
          const barGrad =
            course.avgAttendance >= 85
              ? 'linear-gradient(90deg,#56ebcf,#68fadd)'
              : course.avgAttendance >= 70
              ? 'linear-gradient(90deg,#ff9800,#ffb74d)'
              : 'linear-gradient(90deg,#ff716c,#ff928c)';

          return (
            <Link
              key={course._id}
              href={`/teacher/courses/${course._id}`}
              className="group relative overflow-hidden bg-[#181826] rounded-2xl p-6 border border-[rgba(71,71,84,0.2)] hover:border-[rgba(182,160,255,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(126,81,255,0.15)] transition-all duration-200 block"
            >
              {/* glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: 'radial-gradient(ellipse at top left, rgba(182,160,255,0.06), transparent 70%)' }} />

              {/* top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-[rgba(182,160,255,0.2)] to-[rgba(126,81,255,0.15)] text-[#b6a0ff] border border-[rgba(182,160,255,0.15)] shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold tracking-widest uppercase text-[#b6a0ff] mb-0.5">
                      {course.code}
                    </div>
                    <div className="text-[15px] font-semibold text-[#e9e6f7] leading-tight group-hover:text-white transition-colors">
                      {course.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#aba9b9] group-hover:text-[#b6a0ff] transition-colors mt-1 shrink-0">
                  <ChevronRight size={18} />
                </div>
              </div>

              {/* class label */}
              <div className="flex items-center gap-1.5 text-[12px] text-[#aba9b9] mb-4">
                <Layers size={12} /> {course.className}
              </div>

              {/* tags */}
              <div className="flex gap-1.5 flex-wrap mb-4">
                {course.tags.map(t => <Tag key={t} label={t} />)}
              </div>

              {/* attendance bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] text-[#aba9b9] font-medium">Avg Attendance</span>
                  <AttendancePill pct={course.avgAttendance} />
                </div>
                <div className="h-1.5 bg-[#242434] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${course.avgAttendance}%`, background: barGrad }} />
                </div>
              </div>

              {/* footer row */}
              <div className="flex items-center justify-between pt-3 border-t border-[rgba(71,71,84,0.3)]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[12px] text-[#aba9b9]">
                    <Layers size={12} className="text-[#b6a0ff]" /> {course.classCount} class{course.classCount !== 1 ? 'es' : ''}
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] text-[#aba9b9]">
                    <Users size={12} className="text-[#68fadd]" /> {course.studentCount} students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendBadge trend={course.trend} />
                </div>
              </div>

              {/* last session */}
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#aba9b9]">
                <Clock size={10} /> Last session: {course.lastSession}
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <Star size={28} className="text-[#aba9b9] mb-3" />
          <div className="text-[#e9e6f7] font-semibold">No courses found</div>
          <div className="text-sm text-[#aba9b9] mt-1">Try a different search term.</div>
        </div>
      )}
    </div>
  );
}
