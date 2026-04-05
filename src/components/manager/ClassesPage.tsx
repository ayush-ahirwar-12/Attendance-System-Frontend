'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Pencil, Trash2, Eye, MapPin, X,
  Check, Users, Clock, CalendarDays,
} from 'lucide-react';
import type { ClassItem, Course, Student } from './types';
import { INITIAL_CLASSES, INITIAL_COURSES, STUDENTS } from './mockData';

/* ─── helpers ──────────────────────────────────────────────────────── */
const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getCourse = (courses: Course[], id: string) => courses.find(c => c.id === id);

const Avatar = ({ initials }: { initials: string }) => (
  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7e51ff] to-[#56ebcf] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
    {initials}
  </div>
);

const inputCls = 'w-full bg-[#12121e] border border-[rgba(71,71,84,0.3)] rounded-lg px-3 py-2.5 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:border-[rgba(182,160,255,0.4)] focus:bg-[#0d0d18] transition-all';
const labelCls = 'block text-[10px] font-semibold tracking-widest uppercase text-[#aba9b9] mb-1.5';
const sectionHdrCls = 'text-[10px] font-semibold tracking-widest uppercase text-[#aba9b9] mb-3 pt-1';

/* ─── empty form ───────────────────────────────────────────────────── */
const emptyClass = (): Omit<ClassItem, 'id'> => ({
  section: '',
  courseId: '',
  schedule: { days: [], from: '09:00', to: '10:00' },
  classroomName: '',
  lat: 28.6139,
  lng: 77.2090,
  radius: 50,
  studentIds: [],
});

/* ─── Class Modal ──────────────────────────────────────────────────── */
interface ModalProps {
  mode: 'add' | 'edit' | 'view';
  cls: ClassItem | null;
  courses: Course[];
  students: Student[];
  onClose: () => void;
  onSave: (data: Omit<ClassItem, 'id'>) => void;
}

function ClassModal({ mode, cls, courses, students, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState<Omit<ClassItem, 'id'>>(
    cls
      ? { section: cls.section, courseId: cls.courseId, schedule: { ...cls.schedule, days: [...cls.schedule.days] }, classroomName: cls.classroomName, lat: cls.lat, lng: cls.lng, radius: cls.radius, studentIds: [...cls.studentIds] }
      : emptyClass()
  );
  const [studentSearch, setStudentSearch] = useState('');

  const readOnly = mode === 'view';

  const toggleDay = (day: string) => {
    if (readOnly) return;
    setForm(f => ({
      ...f,
      schedule: {
        ...f.schedule,
        days: f.schedule.days.includes(day)
          ? f.schedule.days.filter(d => d !== day)
          : [...f.schedule.days, day],
      },
    }));
  };

  const toggleStudent = (id: string) => {
    if (readOnly) return;
    setForm(f => ({
      ...f,
      studentIds: f.studentIds.includes(id)
        ? f.studentIds.filter(s => s !== id)
        : [...f.studentIds, id],
    }));
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const isValid = form.section.trim() && form.courseId && form.classroomName.trim() && form.schedule.days.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#181826] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] border border-[rgba(182,160,255,0.08)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[rgba(71,71,84,0.3)] shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#e9e6f7]">
              {mode === 'add' ? 'Create New Class' : mode === 'edit' ? 'Edit Class' : 'Class Details'}
            </h2>
            <p className="text-xs text-[#aba9b9] mt-0.5">
              {mode === 'view' ? `${cls?.classroomName} — ${cls?.section}` : 'Configure all class settings below'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e1e2d] text-[#aba9b9] hover:text-[#e9e6f7] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">

            {/* Section */}
            <div>
              <label className={labelCls}>Section / Class Name</label>
              <input className={inputCls} placeholder="e.g. A or Morning Batch" value={form.section}
                onChange={e => !readOnly && setForm(f => ({ ...f, section: e.target.value }))} readOnly={readOnly} />
            </div>

            {/* Course */}
            <div>
              <label className={labelCls}>Course</label>
              {readOnly ? (
                <div className={inputCls + ' cursor-default'}>
                  {getCourse(courses, form.courseId)
                    ? `${getCourse(courses, form.courseId)!.code} — ${getCourse(courses, form.courseId)!.name}`
                    : '—'}
                </div>
              ) : (
                <select className={inputCls} value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}>
                  <option value="">— Select Course —</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
                </select>
              )}
            </div>

            {/* Schedule : days */}
            <div className="col-span-2">
              <label className={labelCls}>Schedule Days</label>
              <div className="flex gap-2 flex-wrap">
                {ALL_DAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      form.schedule.days.includes(day)
                        ? 'bg-[rgba(182,160,255,0.18)] text-[#b6a0ff] border-[rgba(182,160,255,0.3)]'
                        : 'bg-[#12121e] text-[#aba9b9] border-[rgba(71,71,84,0.3)] hover:text-[#e9e6f7]'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div>
              <label className={labelCls}>Start Time</label>
              <input type="time" className={inputCls} value={form.schedule.from}
                onChange={e => !readOnly && setForm(f => ({ ...f, schedule: { ...f.schedule, from: e.target.value } }))} readOnly={readOnly} />
            </div>
            <div>
              <label className={labelCls}>End Time</label>
              <input type="time" className={inputCls} value={form.schedule.to}
                onChange={e => !readOnly && setForm(f => ({ ...f, schedule: { ...f.schedule, to: e.target.value } }))} readOnly={readOnly} />
            </div>

            {/* Classroom */}
            <div className="col-span-2">
              <label className={labelCls}>Classroom / Room Name</label>
              <input className={inputCls} placeholder="e.g. Room 201 or Lab 404" value={form.classroomName}
                onChange={e => !readOnly && setForm(f => ({ ...f, classroomName: e.target.value }))} readOnly={readOnly} />
            </div>

            {/* GPS */}
            <div className="col-span-2">
              <p className={sectionHdrCls}>📍 GPS Coordinates</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Latitude</label>
                  <input type="number" step="0.0001" className={inputCls} value={form.lat}
                    onChange={e => !readOnly && setForm(f => ({ ...f, lat: parseFloat(e.target.value) || 0 }))} readOnly={readOnly} />
                </div>
                <div>
                  <label className={labelCls}>Longitude</label>
                  <input type="number" step="0.0001" className={inputCls} value={form.lng}
                    onChange={e => !readOnly && setForm(f => ({ ...f, lng: parseFloat(e.target.value) || 0 }))} readOnly={readOnly} />
                </div>
                <div>
                  <label className={labelCls}>Radius (m)</label>
                  <input type="number" min={10} max={500} className={inputCls} value={form.radius}
                    onChange={e => !readOnly && setForm(f => ({ ...f, radius: parseInt(e.target.value) || 50 }))} readOnly={readOnly} />
                </div>
              </div>

              {/* GPS Preview card */}
              <div className="mt-3 bg-[#12121e] rounded-xl p-4 flex items-center gap-4 border border-[rgba(71,71,84,0.2)]">
                <div className="w-12 h-12 rounded-xl bg-[rgba(104,250,221,0.08)] flex items-center justify-center shrink-0">
                  <MapPin size={22} className="text-[#68fadd]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#e9e6f7] mb-1">{form.classroomName || 'Classroom Location'}</div>
                  <div className="text-[11px] text-[#aba9b9] font-mono truncate">
                    {form.lat.toFixed(4)}°N, {form.lng.toFixed(4)}°E &nbsp;·&nbsp; radius: <span className="text-[#68fadd]">{form.radius}m</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[10px] text-[#aba9b9] uppercase tracking-widest">Coverage</div>
                  <div className="text-sm font-bold text-[#68fadd]">~{Math.round(Math.PI * form.radius * form.radius)} m²</div>
                </div>
              </div>
            </div>

            {/* Students */}
            <div className="col-span-2">
              <p className={sectionHdrCls}>👥 Assign Students <span className="text-[#b6a0ff] normal-case tracking-normal font-bold">{form.studentIds.length}</span> selected</p>
              {!readOnly && (
                <div className="relative mb-2">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9b9] pointer-events-none" />
                  <input
                    className="w-full bg-[#12121e] border border-[rgba(71,71,84,0.3)] rounded-lg pl-8 pr-3 py-2 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:border-[rgba(182,160,255,0.3)] transition-all"
                    placeholder="Search students…"
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                  />
                </div>
              )}
              <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                {filteredStudents.map(s => {
                  const selected = form.studentIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleStudent(s.id)}
                      disabled={readOnly}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${
                        selected
                          ? 'bg-[rgba(182,160,255,0.1)] text-[#b6a0ff]'
                          : 'bg-[#12121e] text-[#aba9b9] hover:bg-[#1e1e2d] disabled:hover:bg-[#12121e]'
                      }`}
                    >
                      <Avatar initials={s.initials} />
                      <div className="flex-1">
                        <div className="text-[13px] font-medium">{s.name}</div>
                        <div className="text-[11px] opacity-70">{s.rollNo} · {s.department}</div>
                      </div>
                      {selected && <Check size={14} className="shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        {!readOnly && (
          <div className="px-6 pb-6 pt-4 border-t border-[rgba(71,71,84,0.2)] shrink-0 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] transition-all">
              Cancel
            </button>
            <button
              onClick={() => isValid && onSave(form)}
              disabled={!isValid}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {mode === 'add' ? 'Create Class' : 'Save Changes'}
            </button>
          </div>
        )}
        {readOnly && (
          <div className="px-6 pb-6 pt-4 border-t border-[rgba(71,71,84,0.2)] shrink-0">
            <button onClick={onClose} className="w-full py-2.5 rounded-lg text-sm font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] transition-all">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── main page ────────────────────────────────────────────────────── */
export default function ClassesPage() {
  const courses  = INITIAL_COURSES;
  const students = STUDENTS;

  const [classes, setClasses]   = useState<ClassItem[]>(INITIAL_CLASSES);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState<{ mode: 'add' | 'edit' | 'view'; cls: ClassItem | null } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = classes.filter(cls => {
    const course = getCourse(courses, cls.courseId);
    return (
      cls.section.toLowerCase().includes(search.toLowerCase()) ||
      cls.classroomName.toLowerCase().includes(search.toLowerCase()) ||
      course?.code.toLowerCase().includes(search.toLowerCase()) ||
      course?.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSave = (data: Omit<ClassItem, 'id'>) => {
    if (modal?.mode === 'add') {
      setClasses(prev => [...prev, { id: `cl${Date.now()}`, ...data }]);
    } else if (modal?.mode === 'edit' && modal.cls) {
      setClasses(prev => prev.map(c => c.id === modal.cls!.id ? { ...c, ...data } : c));
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    setDeleteId(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight">Classes</h1>
          <p className="text-sm text-[#aba9b9] mt-1">Create and manage class sections with GPS and student assignments</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add', cls: null })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all"
        >
          <Plus size={15} /> Create Class
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-5">
        {[
          { label: 'Total Classes',    value: classes.length,                                       color: 'text-[#e9e6f7]' },
          { label: 'Unique Courses',   value: new Set(classes.map(c => c.courseId)).size,           color: 'text-[#b6a0ff]' },
          { label: 'Students Assigned',value: new Set(classes.flatMap(c => c.studentIds)).size,     color: 'text-[#68fadd]' },
          { label: 'GPS Configured',   value: classes.filter(c => c.lat && c.lng).length,           color: 'text-[#ff9800]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#181826] rounded-lg px-5 py-2.5 flex items-center gap-2.5">
            <span className={`text-xl font-bold ${color}`}>{value}</span>
            <span className="text-xs text-[#aba9b9]">{label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9b9] pointer-events-none" />
          <input
            className="w-full bg-[#12121e] border border-transparent rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:bg-[#1e1e2d] focus:border-[rgba(182,160,255,0.25)] transition-all"
            placeholder="Search by section, course, room…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#181826] rounded-xl p-6">
        <table className="w-full border-separate border-spacing-y-1">
          <thead>
            <tr>
              {['Section', 'Course', 'Schedule', 'Classroom', 'Students', 'GPS', 'Actions'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9] px-3 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(cls => {
              const course = getCourse(courses, cls.courseId);
              return (
                <tr key={cls.id} className="bg-[#12121e] hover:bg-[#1e1e2d] transition-colors">
                  {/* Section */}
                  <td className="px-3 py-3 rounded-l-lg">
                    <span className="font-semibold text-[#b6a0ff] text-sm">Section {cls.section}</span>
                  </td>

                  {/* Course */}
                  <td className="px-3 py-3">
                    {course ? (
                      <div>
                        <div className="text-[13px] font-medium text-[#e9e6f7]">{course.code}</div>
                        <div className="text-[11px] text-[#aba9b9] mt-0.5">{course.name}</div>
                      </div>
                    ) : <span className="text-[#aba9b9] text-sm">—</span>}
                  </td>

                  {/* Schedule */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={12} className="text-[#aba9b9] shrink-0" />
                      <span className="text-[12px] text-[#e9e6f7]">{cls.schedule.days.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock size={12} className="text-[#aba9b9] shrink-0" />
                      <span className="text-[12px] text-[#aba9b9]">{cls.schedule.from} – {cls.schedule.to}</span>
                    </div>
                  </td>

                  {/* Classroom */}
                  <td className="px-3 py-3">
                    <span className="text-[13px] text-[#e9e6f7]">{cls.classroomName}</span>
                  </td>

                  {/* Students */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5 text-[13px] text-[#aba9b9]">
                      <Users size={13} className="text-[#68fadd]" />
                      <span className="font-semibold text-[#e9e6f7]">{cls.studentIds.length}</span>
                    </div>
                  </td>

                  {/* GPS */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#68fadd] shrink-0" />
                      <div>
                        <div className="text-[11px] font-mono text-[#aba9b9]">{cls.lat.toFixed(3)}°, {cls.lng.toFixed(3)}°</div>
                        <div className="text-[11px] text-[#68fadd]">{cls.radius}m radius</div>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3 rounded-r-lg">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setModal({ mode: 'view', cls })}
                        title="View"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e1e2d] text-[#aba9b9] hover:text-[#e9e6f7] hover:scale-105 transition-all"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setModal({ mode: 'edit', cls })}
                        title="Edit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[rgba(182,160,255,0.08)] text-[#b6a0ff] hover:bg-[rgba(182,160,255,0.15)] hover:scale-105 transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(cls.id)}
                        title="Delete"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[rgba(255,113,108,0.08)] text-[#ff716c] hover:bg-[rgba(255,113,108,0.15)] hover:scale-105 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[#aba9b9] text-sm">
                  No classes match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Class Modal */}
      {modal && (
        <ClassModal
          mode={modal.mode}
          cls={modal.cls}
          courses={courses}
          students={students}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-sm bg-[#181826] rounded-2xl p-6 border border-[rgba(255,113,108,0.15)] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
            <div className="w-12 h-12 rounded-full bg-[rgba(255,113,108,0.12)] flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-[#ff716c]" />
            </div>
            <h3 className="text-base font-bold text-[#e9e6f7] text-center">Delete Class?</h3>
            <p className="text-sm text-[#aba9b9] text-center mt-1 mb-5">
              This will permanently remove <span className="text-[#e9e6f7] font-semibold">Section {classes.find(c => c.id === deleteId)?.section}</span> and its student assignments.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#ff716c] to-[#ff928c] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(255,113,108,0.3)] transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
