'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, UserCheck, X, Check } from 'lucide-react';
import type { Course } from './types';
import { useQueryClient } from '@tanstack/react-query';
import { useGetTeachers } from '@/features/user/hooks/useUserApi';
import { useGetCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/features/course/hooks/useCourseApi';
import { useGetClasses } from '@/features/class/hooks/useClassApi';

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
  backendClasses: any[];
  backendTeachers: any[];
  onClose: () => void;
  onSave: (data: Omit<Course, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onAssign: (courseId: string, teacherId: string | null) => void;
}

function CourseModal({ mode, course, backendClasses, backendTeachers, onClose, onSave, onAssign }: ModalProps) {
  // Helpers to resolve names to backend IDs for the select inputs
  const getTeacherId = (val: string | null | undefined) => {
    if (!val) return null;
    const found = backendTeachers.find(t => t.name === val || t._id === val || t.id === val);
    return found ? (found._id || found.id) : val;
  };

  const getClassId = (val: string | null | undefined) => {
    if (!val) return '';
    const found = backendClasses.find(c => c.section === val || c.name === val || c._id === val || c.id === val || `${c.section} ${c.name ? `(${c.name})` : ''}`.trim() === val);
    return found ? (found._id || found.id) : val;
  };

  const [form, setForm] = useState<Omit<Course, '_id' | 'createdAt' | 'updatedAt'>>(
    course ? { code: course.code, name: course.name, class: getClassId(course.class), teacher: getTeacherId(course.teacher) }
           : emptyForm()
  );
  const [assignTeacher, setAssignTeacher] = useState<string | null>(getTeacherId(course?.teacher) ?? null);

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
                    {backendClasses.map(c => (
                      <option key={c._id || (c as any).id} value={c._id}>
                        {c.section} {c.name ? `(${c.name})` : ''}
                      </option>
                    ))}
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
                  {backendTeachers.map(t => (
                    <option key={t._id || t.id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
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
                {backendTeachers.map(t => (
                  <button
                    key={t._id || t.id}
                    onClick={() => setAssignTeacher(t._id || t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                      assignTeacher === (t._id || t.id) ? 'bg-[rgba(182,160,255,0.12)] text-[#b6a0ff]' : 'bg-[#12121e] text-[#aba9b9] hover:bg-[#1e1e2d]'}`}
                  >
                    <Avatar initials={t.name ? t.name.charAt(0).toUpperCase() : '?'} />
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                    </div>
                    {assignTeacher === (t._id || t.id) && <Check size={14} className="ml-auto" />}
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


  const queryClient = useQueryClient();
  const { data: fetchedCourses, isPending } = useGetCourses();  
  const { mutate: createCourseMutate, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourseMutate, isPending: isUpdating } = useUpdateCourse();
  const { mutate: deleteCourseMutate, isPending: isDeleting } = useDeleteCourse();
  const { data: fetchedClassesData } = useGetClasses();
  const { data: fetchedTeachersData } = useGetTeachers();

  const backendClasses = useMemo(() => {
    if (!fetchedClassesData) return [];
    return Array.isArray(fetchedClassesData) ? fetchedClassesData : (fetchedClassesData.data || []);
  }, [fetchedClassesData]);

  const backendTeachers = useMemo(() => {
    if (!fetchedTeachersData) return [];
    return Array.isArray(fetchedTeachersData) ? fetchedTeachersData : (fetchedTeachersData.data || []);
  }, [fetchedTeachersData]);
  
  const courses: Course[] = useMemo(() => {
    if (!fetchedCourses) return [];
    if (Array.isArray(fetchedCourses)) return fetchedCourses;
    if (fetchedCourses.courses && Array.isArray(fetchedCourses.courses)) return fetchedCourses.courses;
    if (fetchedCourses.data && Array.isArray(fetchedCourses.data)) return fetchedCourses.data;
    return [];
  }, [fetchedCourses]);

  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState<{ mode: 'add' | 'edit' | 'assign'; course: Course | null } | null>(null);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  const filtered = courses.filter(c => {
    return c.code.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase());
  });


  /* Cache updater helper */
  const updateCache = (updater: (arr: Course[]) => Course[]) => {
    queryClient.setQueryData(["allCourses"], (old: any) => {
      if (!old) return old;
      if (Array.isArray(old)) return updater(old);
      if (old.courses) return { ...old, courses: updater(old.courses) };
      if (old.data) return { ...old, data: updater(old.data) };
      return old;
    });
  };

  /* CRUD handlers */
  const handleSave = (data: Omit<Course, '_id'>) => {
    if (modal?.mode === 'add') {
      createCourseMutate(data, {
        onSuccess: () => {
          setModal(null);
        }
      });
    } else if (modal?.mode === 'edit' && modal.course) {
      updateCourseMutate({ id: modal.course._id, body: data }, {
        onSuccess: () => {
          setModal(null);
        }
      });
    }
  };

  const handleAssign = (courseId: string, teacherId: string | null) => {
    updateCourseMutate({ id: courseId, body: { teacher: teacherId } }, {
      onSuccess: () => {
        setModal(null);
      }
    });
  };

  const handleDelete = (id: string) => {
    deleteCourseMutate(id, {
      onSuccess: () => {
        setDeleteId(null);
      }
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgba(182,160,255,1)]"></div>
        <span className="ml-3 text-[#aba9b9] text-sm font-medium tracking-wide">Loading courses data...</span>
      </div>
    );
  }

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
              return (
                <tr key={course._id} className="bg-[#12121e] hover:bg-[#1e1e2d] transition-colors group">
                  <td className="px-3 py-3 rounded-l-lg">
                    <span className="font-semibold text-[#b6a0ff] text-sm font-mono">{course.code}</span>
                  </td>
                  <td className="px-3 py-3 text-[13px] font-medium text-[#e9e6f7]">{course.name}</td>
                  <td className="px-3 py-3">
                    {course.class ? (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-[#242434] text-[#aba9b9]">
                        {course.class}
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-[#242434] text-[#aba9b9]">Unassigned Class</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {course.teacher ? (
                      <div className="flex items-center gap-2">
                        <Avatar initials={course.teacher.charAt(0).toUpperCase()} />
                        <span className="text-[13px] text-[#e9e6f7]">{course.teacher}</span>
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
          backendClasses={backendClasses}
          backendTeachers={backendTeachers}
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
