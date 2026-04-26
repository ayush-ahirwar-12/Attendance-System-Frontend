'use client';

import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, UserCheck, X, Check } from 'lucide-react';
import type { Course, Teacher, ClassItem } from './types';
import { INITIAL_COURSES, TEACHERS, INITIAL_CLASSES } from './mockData';

/* ─── helpers ─────────────────────────────────────────────────────── */
const Avatar = ({ initials, color = 'from-[#7e51ff] to-[#56ebcf]' }: { initials: string; color?: string }) => (
  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
    {initials}
  </div>
);

/* ─── empty course form ────────────────────────────────────────────── */
const emptyForm = (): Omit<Course, '_id' | 'createdAt' | 'updatedAt'> => ({
  code: '', name: '', class: '', teacher: null,
});

/* ─── modal ────────────────────────────────────────────────────────── */
interface ModalProps {
  mode: 'add' | 'edit' | 'assign';
  course: Course | null;
  teachers: Teacher[];
  classes: ClassItem[];
  onClose: () => void;
  onSave: (data: Omit<Course, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onAssign: (courseId: string, teacherId: string | null) => void;
}

function CourseModal({ mode, course, teachers, classes, onClose, onSave, onAssign }: ModalProps) {
  const [form, setForm] = useState<Omit<Course, '_id' | 'createdAt' | 'updatedAt'>>(
    course ? { code: course.code, name: course.name, class: course.class, teacher: course.teacher }
           : emptyForm()
  );
  const [assignTeacher, setAssignTeacher] = useState<string | null>(course?.teacher ?? null);

  const inputCls = 'w-full bg-[#12121e] border border-[rgba(71,71,84,0.3)] rounded-lg px-3 py-2.5 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:border-[rgba(182,160,255,0.4)] focus:bg-[#0d0d18] transition-all';
  const labelCls = 'block text-[10px] font-semibold tracking-widest uppercase text-[#aba9b9] mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#181826] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] border border-[rgba(182,160,255,0.08)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[rgba(71,71,84,0.3)]">
          <div>
            <h2 className="text-base font-bold text-[#e9e6f7]">
              {mode === 'add' ? 'Add New Course' : mode === 'edit' ? 'Edit Course' : 'Assign Teacher'}
            </h2>
            <p className="text-xs text-[#aba9b9] mt-0.5">
              {mode === 'add' ? 'Fill in the details below' : mode === 'edit' ? `Editing ${course?.code}` : `Course: ${course?.code} – ${course?.name}`}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e1e2d] text-[#aba9b9] hover:text-[#e9e6f7] transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          {mode !== 'assign' ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Course Code</label>
                  <input className={inputCls} placeholder="e.g. CS301" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Class</label>
                  <select className={inputCls} value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))}>
                    <option value="">— Select Class —</option>
                    {classes.map(c => <option key={c._id || (c as any).id} value={c._id || (c as any).id}>{c.section} {c.name ? `(${c.name})` : ''}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Course Name</label>
                <input className={inputCls} placeholder="e.g. Algorithm Design" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Assign Teacher</label>
                <select className={inputCls} value={form.teacher ?? ''} onChange={e => setForm(f => ({ ...f, teacher: e.target.value || null }))}>
                  <option value="">— Unassigned —</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.department})</option>)}
                </select>
              </div>
            </div>
          ) : (
            /* Assign Teacher mode */
            <div className="flex flex-col gap-3">
              <p className="text-xs text-[#aba9b9]">Select a teacher to assign to this course:</p>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                <button
                  onClick={() => setAssignTeacher(null)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                    assignTeacher === null ? 'bg-[rgba(255,113,108,0.12)] text-[#ff716c]' : 'bg-[#12121e] text-[#aba9b9] hover:bg-[#1e1e2d]'}`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#242434] flex items-center justify-center text-[10px] font-bold">—</div>
                  <div>
                    <div className="text-sm font-medium">Unassigned</div>
                    <div className="text-[11px] text-[#aba9b9]">Remove teacher from course</div>
                  </div>
                  {assignTeacher === null && <Check size={14} className="ml-auto" />}
                </button>
                {teachers.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setAssignTeacher(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                      assignTeacher === t.id ? 'bg-[rgba(182,160,255,0.12)] text-[#b6a0ff]' : 'bg-[#12121e] text-[#aba9b9] hover:bg-[#1e1e2d]'}`}
                  >
                    <Avatar initials={t.initials} />
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-[11px] text-[#aba9b9]">{t.department} · {t.email}</div>
                    </div>
                    {assignTeacher === t.id && <Check size={14} className="ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] transition-all">
            Cancel
          </button>
          <button
            onClick={() => {
              if (mode === 'assign' && course) {
                onAssign(course._id, assignTeacher);
              } else {
                onSave(form);
              }
            }}
            disabled={mode !== 'assign' && (!form.code.trim() || !form.name.trim() || !form.class)}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {mode === 'assign' ? 'Confirm Assign' : mode === 'add' ? 'Create Course' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── main page ────────────────────────────────────────────────────── */
export default function CoursesPage() {
  const [courses, setCourses]     = useState<Course[]>(INITIAL_COURSES);
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState<{ mode: 'add' | 'edit' | 'assign'; course: Course | null } | null>(null);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  const teachers = TEACHERS;
  const classes = INITIAL_CLASSES;

  const filtered = courses.filter(c => {
    return c.code.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase());
  });

  /* CRUD handlers */
  const handleSave = (data: Omit<Course, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (modal?.mode === 'add') {
      const _id = `c${Date.now()}`;
      setCourses(prev => [...prev, { _id, ...data }]);
    } else if (modal?.mode === 'edit' && modal.course) {
      setCourses(prev => prev.map(c => c._id === modal.course!._id ? { ...c, ...data } : c));
    }
    setModal(null);
  };

  const handleAssign = (courseId: string, teacherId: string | null) => {
    setCourses(prev => prev.map(c => c._id === courseId ? { ...c, teacher: teacherId } : c));
    setModal(null);
  };

  const handleDelete = (id: string) => {
    setCourses(prev => prev.filter(c => c._id !== id));
    setDeleteId(null);
  };

  const getTeacher = (id: string | null | undefined) => teachers.find(t => t.id === id) ?? null;
  const getClassItem = (id: string) => classes.find(c => c._id === id || (c as any).id === id) ?? null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight">Courses</h1>
          <p className="text-sm text-[#aba9b9] mt-1">Manage all courses and their assigned teachers</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add', course: null })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all"
        >
          <Plus size={15} /> Add Course
        </button>
      </div>

      {/* Stats chips */}
      <div className="flex gap-3 mb-5">
        <div className="bg-[#181826] rounded-lg px-5 py-2.5 flex items-center gap-2.5">
          <span className="text-xl font-bold text-[#e9e6f7]">{courses.length}</span>
          <span className="text-xs text-[#aba9b9]">Total Courses</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9b9] pointer-events-none" />
          <input
            className="w-full bg-[#12121e] border border-transparent rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:bg-[#1e1e2d] focus:border-[rgba(182,160,255,0.25)] transition-all"
            placeholder="Search by code or name…"
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
              {['Code', 'Course Name', 'Class', 'Assigned Teacher', 'Actions'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9] px-3 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(course => {
              const teacher = getTeacher(course.teacher);
              const classItem = getClassItem(course.class);
              
              return (
                <tr key={course._id} className="bg-[#12121e] hover:bg-[#1e1e2d] transition-colors group">
                  <td className="px-3 py-3 rounded-l-lg">
                    <span className="font-semibold text-[#b6a0ff] text-sm font-mono">{course.code}</span>
                  </td>
                  <td className="px-3 py-3 text-[13px] font-medium text-[#e9e6f7]">{course.name}</td>
                  <td className="px-3 py-3">
                    {classItem ? (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-[#242434] text-[#aba9b9]">
                        {classItem.section} {classItem.name ? `(${classItem.name})` : ''}
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-[#242434] text-[#aba9b9]">Unassigned Class</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {teacher ? (
                      <div className="flex items-center gap-2">
                        <Avatar initials={teacher.initials} />
                        <span className="text-[13px] text-[#e9e6f7]">{teacher.name}</span>
                      </div>
                    ) : (
                      <span className="text-[13px] text-[#ff716c] italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-3 py-3 rounded-r-lg">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setModal({ mode: 'assign', course })}
                        title="Assign Teacher"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[rgba(104,250,221,0.08)] text-[#68fadd] hover:bg-[rgba(104,250,221,0.15)] hover:scale-105 transition-all"
                      >
                        <UserCheck size={14} />
                      </button>
                      <button
                        onClick={() => setModal({ mode: 'edit', course })}
                        title="Edit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[rgba(182,160,255,0.08)] text-[#b6a0ff] hover:bg-[rgba(182,160,255,0.15)] hover:scale-105 transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(course._id)}
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
                <td colSpan={5} className="text-center py-12 text-[#aba9b9] text-sm">
                  No courses match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Course Modal */}
      {modal && (
        <CourseModal
          mode={modal.mode}
          course={modal.course}
          teachers={teachers}
          classes={classes}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onAssign={handleAssign}
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
            <h3 className="text-base font-bold text-[#e9e6f7] text-center">Delete Course?</h3>
            <p className="text-sm text-[#aba9b9] text-center mt-1 mb-5">
              This will permanently remove <span className="text-[#e9e6f7] font-semibold">{courses.find(c => c._id === deleteId)?.code}</span> and all related data.
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
