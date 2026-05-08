'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  BookOpen, ChevronRight, Users, Clock, MapPin,
  Calendar, ArrowLeft, Layers, BarChart3,
} from 'lucide-react';

// ─── Sample data: mirrors GET /api/teacher/courses/:courseId/classes ──────────
interface CourseClass {
  _id: string;
  section: string;
  name: string;            // e.g. "CS Year 3 – Section A"
  schedule: { days: string[]; from: string; to: string };
  room: string;
  studentCount: number;
  avgAttendance: number;
  lastLecture: string;
  totalLectures: number;
}

const COURSE_META: Record<string, { code: string; name: string }> = {
  'course-1': { code: 'CS301', name: 'Algorithm Design' },
  'course-2': { code: 'CS205', name: 'Data Structures' },
  'course-3': { code: 'CS401', name: 'Machine Learning' },
  'course-4': { code: 'CS102', name: 'Python Programming' },
  'course-5': { code: 'CS303', name: 'Computer Networks' },
  'course-6': { code: 'CS502', name: 'Deep Learning' },
};

const CLASSES_BY_COURSE: Record<string, CourseClass[]> = {
  'course-1': [
    {
      _id: 'cls-1a', section: 'A', name: 'CS Year 3 – Section A',
      schedule: { days: ['Mon', 'Wed', 'Fri'], from: '09:00', to: '10:00' },
      room: 'Room 201', studentCount: 20, avgAttendance: 95, lastLecture: '2 hours ago', totalLectures: 18,
    },
    {
      _id: 'cls-1b', section: 'B', name: 'CS Year 3 – Section B',
      schedule: { days: ['Tue', 'Thu'], from: '11:00', to: '12:30' },
      room: 'Room 105', studentCount: 18, avgAttendance: 88, lastLecture: 'Yesterday', totalLectures: 12,
    },
  ],
  'course-2': [
    {
      _id: 'cls-2a', section: 'A', name: 'CS Year 2 – Section A',
      schedule: { days: ['Mon', 'Wed'], from: '08:00', to: '09:30' },
      room: 'Room 301', studentCount: 15, avgAttendance: 82, lastLecture: 'Yesterday', totalLectures: 14,
    },
    {
      _id: 'cls-2b', section: 'B', name: 'CS Year 2 – Section B',
      schedule: { days: ['Tue', 'Thu', 'Fri'], from: '13:00', to: '14:00' },
      room: 'Lab 404', studentCount: 14, avgAttendance: 90, lastLecture: '3 hours ago', totalLectures: 20,
    },
    {
      _id: 'cls-2c', section: 'C', name: 'CS Year 2 – Section C',
      schedule: { days: ['Mon', 'Fri'], from: '15:00', to: '16:30' },
      room: 'Room 202', studentCount: 13, avgAttendance: 80, lastLecture: '2 days ago', totalLectures: 10,
    },
  ],
  'course-3': [
    {
      _id: 'cls-3a', section: 'A', name: 'CS Year 4 – Section A',
      schedule: { days: ['Wed', 'Fri'], from: '14:00', to: '15:30' },
      room: 'Lab 301', studentCount: 35, avgAttendance: 70, lastLecture: '3 days ago', totalLectures: 9,
    },
  ],
  'course-4': [
    {
      _id: 'cls-4a', section: 'A', name: 'CS Year 1 – Section A',
      schedule: { days: ['Mon', 'Tue', 'Thu'], from: '10:00', to: '11:00' },
      room: 'Room 101', studentCount: 25, avgAttendance: 92, lastLecture: 'Today', totalLectures: 22,
    },
    {
      _id: 'cls-4b', section: 'C', name: 'CS Year 1 – Section C',
      schedule: { days: ['Wed', 'Fri'], from: '09:00', to: '10:30' },
      room: 'Room 103', studentCount: 25, avgAttendance: 85, lastLecture: 'Today', totalLectures: 15,
    },
  ],
  'course-5': [
    {
      _id: 'cls-5a', section: 'A', name: 'CS Year 3 – Section A',
      schedule: { days: ['Mon', 'Wed'], from: '11:00', to: '12:30' },
      room: 'Room 204', studentCount: 20, avgAttendance: 78, lastLecture: '4 days ago', totalLectures: 8,
    },
    {
      _id: 'cls-5b', section: 'B', name: 'CS Year 3 – Section B',
      schedule: { days: ['Tue', 'Thu'], from: '14:00', to: '15:30' },
      room: 'Room 205', studentCount: 20, avgAttendance: 74, lastLecture: '4 days ago', totalLectures: 8,
    },
  ],
  'course-6': [
    {
      _id: 'cls-6a', section: 'A', name: 'CS Year 5 – Section A',
      schedule: { days: ['Tue', 'Thu'], from: '16:00', to: '17:30' },
      room: 'Lab 502', studentCount: 22, avgAttendance: 95, lastLecture: '1 day ago', totalLectures: 6,
    },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const attColor = (p: number) =>
  p >= 85 ? '#68fadd' : p >= 70 ? '#ff9800' : '#ff716c';
const attGrad = (p: number) =>
  p >= 85
    ? 'linear-gradient(90deg,#56ebcf,#68fadd)'
    : p >= 70
    ? 'linear-gradient(90deg,#ff9800,#ffb74d)'
    : 'linear-gradient(90deg,#ff716c,#ff928c)';

export default function CourseClassesPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId ?? '';
  const meta = COURSE_META[courseId] ?? { code: '—', name: 'Unknown Course' };
  const classes = CLASSES_BY_COURSE[courseId] ?? [];

  return (
    <div>
      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-[#aba9b9] mb-6">
        <Link href="/teacher/courses" className="flex items-center gap-1.5 hover:text-[#b6a0ff] transition-colors">
          <ArrowLeft size={14} /> My Courses
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#e9e6f7] font-medium">{meta.code} – {meta.name}</span>
      </div>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[rgba(182,160,255,0.12)] text-[#b6a0ff] border border-[rgba(182,160,255,0.2)] mb-3">
            <BookOpen size={11} /> {meta.code}
          </div>
          <h1 className="text-[26px] font-bold text-[#e9e6f7] tracking-tight">{meta.name}</h1>
          <p className="text-sm text-[#aba9b9] mt-1">
            {classes.length} class section{classes.length !== 1 ? 's' : ''} · select one to view its student roster
          </p>
        </div>
      </div>

      {/* ── Class cards ──────────────────────────────────────────────────── */}
      {classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-52 border-2 border-dashed border-[rgba(182,160,255,0.15)] rounded-2xl text-center">
          <Layers size={28} className="text-[#aba9b9] mb-3" />
          <div className="text-[#e9e6f7] font-semibold">No classes found</div>
          <div className="text-sm text-[#aba9b9] mt-1">This course has no sections assigned yet.</div>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {classes.map(cls => (
            <Link
              key={cls._id}
              href={`/teacher/courses/${courseId}/classes/${cls._id}`}
              className="group relative overflow-hidden bg-[#181826] rounded-2xl p-6 border border-[rgba(71,71,84,0.2)] hover:border-[rgba(182,160,255,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(126,81,255,0.12)] transition-all duration-200 block"
            >
              {/* glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at top left, rgba(182,160,255,0.05), transparent 65%)' }} />

              {/* section badge + arrow */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-[rgba(104,250,221,0.18)] to-[rgba(86,235,207,0.1)] text-[#68fadd] border border-[rgba(104,250,221,0.15)] text-sm font-bold shrink-0">
                  {cls.section}
                </div>
                <ChevronRight size={18} className="text-[#aba9b9] group-hover:text-[#b6a0ff] transition-colors mt-1 shrink-0" />
              </div>

              {/* name */}
              <div className="text-[15px] font-semibold text-[#e9e6f7] mb-1 group-hover:text-white transition-colors">
                {cls.name}
              </div>

              {/* schedule */}
              <div className="flex items-center gap-1.5 text-[12px] text-[#aba9b9] mb-4">
                <Calendar size={11} /> {cls.schedule.days.join(', ')} &nbsp;·&nbsp;
                <Clock size={11} /> {cls.schedule.from} – {cls.schedule.to}
              </div>

              {/* room */}
              <div className="flex items-center gap-1.5 text-[12px] text-[#aba9b9] mb-4">
                <MapPin size={11} className="text-[#b6a0ff]" /> {cls.room}
              </div>

              {/* attendance bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] text-[#aba9b9]">Avg Attendance</span>
                  <span className="text-[11px] font-bold" style={{ color: attColor(cls.avgAttendance) }}>
                    {cls.avgAttendance}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#242434] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${cls.avgAttendance}%`, background: attGrad(cls.avgAttendance) }} />
                </div>
              </div>

              {/* footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[rgba(71,71,84,0.3)]">
                <span className="flex items-center gap-1.5 text-[12px] text-[#aba9b9]">
                  <Users size={12} className="text-[#68fadd]" /> {cls.studentCount} students
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-[#aba9b9]">
                  <BarChart3 size={12} className="text-[#b6a0ff]" /> {cls.totalLectures} lectures
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#aba9b9]">
                <Clock size={10} /> Last: {cls.lastLecture}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
