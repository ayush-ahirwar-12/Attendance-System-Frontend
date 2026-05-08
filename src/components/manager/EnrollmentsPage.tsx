'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Pencil, Trash2, GraduationCap,
  CheckCircle, XCircle, Clock, ChevronDown,
} from 'lucide-react';
import { useGetAllEnrollments, useUpdateEnrollment, useDeleteEnrollment, useEnrollStudent } from '@/features/enrollment/hooks/useEnrollmentApi';
import { useGetClasses } from '@/features/class/hooks/useClassApi';
import { useGetCourses } from '@/features/course/hooks/useCourseApi';
import { useGetAllUsers } from '@/features/user/hooks/useUserApi';
import type { EnrollmentRecord } from '@/api/enrollment/getEnrollments';
import EnrollStudentModal from '@/components/manager/users/EnrollStudentModal';
import EditEnrollmentModal from './enrollments/EditEnrollmentModal';
import type { User } from '@/components/manager/users/types';

/* ─── Status badge ─────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
    active:    { color: '#68fadd', bg: 'rgba(104,250,221,0.10)',  border: 'rgba(104,250,221,0.25)', icon: <CheckCircle size={11} /> },
    dropped:   { color: '#ff716c', bg: 'rgba(255,113,108,0.10)', border: 'rgba(255,113,108,0.25)', icon: <XCircle     size={11} /> },
    completed: { color: '#b6a0ff', bg: 'rgba(182,160,255,0.10)', border: 'rgba(182,160,255,0.25)', icon: <Clock       size={11} /> },
  };
  const s = map[status] ?? map['active'];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border"
      style={{ color: s.color, background: s.bg, borderColor: s.border }}
    >
      {s.icon}{status}
    </span>
  );
}

export default function EnrollmentsPage() {
  /* ── Class selector state ───────────────────────────────────────── */
  const [selectedClassId, setSelectedClassId] = useState('');

  const { data: fetchedClassesData } = useGetClasses();
  const { data: fetchedCoursesData } = useGetCourses();
  const { data: usersData } = useGetAllUsers({ page: 1, limit: 100, search: '' });

  const { data: enrollments = [], isPending, isError } = useGetAllEnrollments();

  const { mutate: updateMutate, isPending: isUpdating } = useUpdateEnrollment();
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteEnrollment();
  const { mutate: enrollMutate, isPending: isEnrolling } = useEnrollStudent();

  /* ── UI state ───────────────────────────────────────────────────── */
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'dropped' | 'completed'>('all');
  const [editTarget, setEditTarget] = useState<EnrollmentRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showStudentPicker, setShowStudentPicker] = useState(false);
  const [enrollStudent, setEnrollStudent] = useState<User | null>(null);

  /* ── Derived data ───────────────────────────────────────────────── */
  const classes = useMemo(() => {
    if (!fetchedClassesData) return [];
    return (Array.isArray(fetchedClassesData) ? fetchedClassesData : (fetchedClassesData.data || [])) as { _id: string; section: string; name: string }[];
  }, [fetchedClassesData]);

  const courses = useMemo(() => {
    if (!fetchedCoursesData) return [];
    if (Array.isArray(fetchedCoursesData)) return fetchedCoursesData;
    if (fetchedCoursesData.courses) return fetchedCoursesData.courses;
    return fetchedCoursesData.data || [];
  }, [fetchedCoursesData]);

  const students: User[] = useMemo(() => {
    if (!usersData) return [];
    const arr = Array.isArray(usersData) ? usersData : (usersData.data || []);
    return arr.filter((u: User) => u.role?.name === 'student');
  }, [usersData]);

  const selectedClass = classes.find(c => c._id === selectedClassId);

  const filtered = useMemo(() => {
    return (enrollments as EnrollmentRecord[]).filter(e => {
      const name  = `${e.student?.firstName ?? ''} ${e.student?.lastName ?? ''}`.toLowerCase();
      const email = (e.student?.email ?? '').toLowerCase();
      const q     = search.toLowerCase();
      const matchSearch = !search || name.includes(q) || email.includes(q) || (e.course?.name ?? '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchClass = !selectedClassId || e.class?._id === selectedClassId;
      return matchSearch && matchStatus && matchClass;
    });
  }, [enrollments, search, statusFilter, selectedClassId]);

  const stats = useMemo(() => ({
    total:     filtered.length,
    active:    filtered.filter(e => e.status === 'active').length,
    dropped:   filtered.filter(e => e.status === 'dropped').length,
    completed: filtered.filter(e => e.status === 'completed').length,
  }), [filtered]);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleEdit = (payload: { status: any; class: string; course?: string | null }) => {
    if (!editTarget) return;
    updateMutate({ id: editTarget._id, payload }, { onSuccess: () => setEditTarget(null) });
  };

  const handleDelete = (id: string) => {
    deleteMutate(id, { onSuccess: () => setDeleteId(null) });
  };

  const handleEnroll = (payload: { student: string; classId: string; courseId?: string | null; status: any }) => {
    enrollMutate(
      payload,
      { onSuccess: () => { setShowStudentPicker(false); setEnrollStudent(null); } }
    );
  };

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight">Enrollments</h1>
          <p className="text-sm text-[#aba9b9] mt-1">View and manage student enrollments by class</p>
        </div>
        <button
          onClick={() => setShowStudentPicker(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all"
        >
          <Plus size={15} /> Enroll Student
        </button>
      </div>

      {/* Class selector */}
      <div className="mb-5">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-[#aba9b9] mb-1.5">
          Select Class to View Enrollments
        </label>
        <div className="relative max-w-sm">
          <select
            className="w-full appearance-none bg-[#181826] border border-[rgba(71,71,84,0.4)] rounded-xl px-4 py-3 pr-10 text-sm text-[#e9e6f7] focus:outline-none focus:border-[rgba(182,160,255,0.4)] transition-all cursor-pointer"
            value={selectedClassId}
            onChange={e => { setSelectedClassId(e.target.value); setSearch(''); setStatusFilter('all'); }}
          >
            <option value="" style={{ background: '#181826' }}>— All Classes —</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id} style={{ background: '#181826' }}>
                Section {cls.section}{cls.name ? ` · ${cls.name}` : ''}
              </option>
            ))}
          </select>
          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aba9b9] pointer-events-none" />
        </div>
      </div>

      {/* Stats chips */}
        <div className="flex gap-3 mb-5 flex-wrap">
          {[
            { label: 'Total',     value: stats.total,     color: 'text-[#e9e6f7]', icon: <GraduationCap size={15} className="text-[#b6a0ff]" /> },
            { label: 'Active',    value: stats.active,    color: 'text-[#68fadd]', icon: <CheckCircle   size={15} className="text-[#68fadd]" /> },
            { label: 'Dropped',   value: stats.dropped,   color: 'text-[#ff716c]', icon: <XCircle       size={15} className="text-[#ff716c]" /> },
            { label: 'Completed', value: stats.completed, color: 'text-[#b6a0ff]', icon: <Clock         size={15} className="text-[#b6a0ff]" /> },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="bg-[#181826] rounded-lg px-5 py-2.5 flex items-center gap-2.5">
              {icon}
              <span className={`text-xl font-bold ${color}`}>{value}</span>
              <span className="text-xs text-[#aba9b9]">{label}</span>
            </div>
          ))}
        </div>

      {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative max-w-xs w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9b9] pointer-events-none" />
            <input
              className="w-full bg-[#12121e] border border-transparent rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:bg-[#1e1e2d] focus:border-[rgba(182,160,255,0.25)] transition-all"
              placeholder="Search by student or course…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'active', 'dropped', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${statusFilter === f ? 'bg-[rgba(182,160,255,0.15)] text-[#b6a0ff] border-[rgba(182,160,255,0.3)]' : 'text-[#aba9b9] border-[rgba(71,71,84,0.3)] hover:bg-[#181826] hover:text-[#e9e6f7]'}`}
              >
                {f}
              </button>
            ))}
          </div>
          {(search || statusFilter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); }}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.3)] hover:bg-[#181826] hover:text-[#e9e6f7] transition-all"
            >
              Clear
            </button>
          )}
        </div>

      {/* Empty / loading states */}

      {isPending && (
        <div className="flex items-center justify-center h-48 gap-3">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#b6a0ff]" />
          <span className="text-[#aba9b9] text-sm font-medium tracking-wide">Loading enrollments…</span>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center h-48">
          <p className="text-[#ff716c] text-sm">Failed to load enrollments. Please try again.</p>
        </div>
      )}

      {/* Table */}
      {!isPending && !isError && (
        <div className="bg-[#181826] rounded-xl p-6">
          {selectedClass && (
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#aba9b9]">Showing enrollments for</span>
              <span className="text-[11px] font-bold text-[#b6a0ff] bg-[rgba(182,160,255,0.1)] border border-[rgba(182,160,255,0.2)] px-2.5 py-0.5 rounded-full">
                Section {selectedClass.section}{selectedClass.name ? ` · ${selectedClass.name}` : ''}
              </span>
            </div>
          )}
          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr>
                {['Student', 'Course', 'Status', 'Enrolled At', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9] px-3 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(enr => {
                const initials = `${enr.student?.firstName?.charAt(0) ?? ''}${enr.student?.lastName?.charAt(0) ?? ''}`.toUpperCase();
                const enrolledDate = enr.createdAt
                  ? new Date(enr.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—';
                return (
                  <tr key={enr._id} className="bg-[#12121e] hover:bg-[#1e1e2d] transition-colors group">
                    {/* Student */}
                    <td className="px-3 py-3 rounded-l-lg">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7e51ff] to-[#56ebcf] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                          {initials || '?'}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#e9e6f7]">
                            {enr.student?.firstName} {enr.student?.lastName}
                          </div>
                          <div className="text-[11px] text-[#aba9b9]">{enr.student?.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="px-3 py-3">
                      {enr.course ? (
                        <div>
                          <div className="text-[13px] font-medium text-[#e9e6f7]">{enr.course.code}</div>
                          <div className="text-[11px] text-[#aba9b9]">{enr.course.name}</div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(104,250,221,0.08)] text-[#68fadd] border border-[rgba(104,250,221,0.2)]">
                          Compulsory
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <StatusBadge status={enr.status} />
                    </td>

                    {/* Enrolled At */}
                    <td className="px-3 py-3">
                      <span className="text-[12px] text-[#aba9b9]">{enrolledDate}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3 rounded-r-lg">
                      <div className="flex gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditTarget(enr)}
                          title="Edit"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[rgba(182,160,255,0.08)] text-[#b6a0ff] hover:bg-[rgba(182,160,255,0.18)] hover:scale-105 transition-all"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(enr._id)}
                          title="Delete"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[rgba(255,113,108,0.08)] text-[#ff716c] hover:bg-[rgba(255,113,108,0.18)] hover:scale-105 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-14">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-[rgba(182,160,255,0.08)] flex items-center justify-center">
                        <GraduationCap size={26} className="text-[#b6a0ff] opacity-50" />
                      </div>
                      <p className="text-[#aba9b9] text-sm">
                        {search || statusFilter !== 'all'
                          ? 'No enrollments match your filters.'
                          : 'No students enrolled in this class yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Student picker (step 1 of new enrollment) ────────────────── */}
      {showStudentPicker && !enrollStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowStudentPicker(false)} />
          <div className="relative w-full max-w-sm bg-[#181826] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.7)] border border-[rgba(71,71,84,0.3)] p-6">
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg,#b6a0ff,#68fadd)' }} />
            <h2 className="text-base font-bold text-[#e9e6f7] mb-1">Select a Student</h2>
            <p className="text-[12px] text-[#aba9b9] mb-4">Choose which student to enroll</p>
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
              {students.map((s: User) => {
                const ini = `${s.firstName?.charAt(0) ?? ''}${s.lastName?.charAt(0) ?? ''}`.toUpperCase();
                return (
                  <button
                    key={s._id}
                    onClick={() => setEnrollStudent(s)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#12121e] hover:bg-[#1e1e2d] transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7e51ff] to-[#56ebcf] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                      {ini || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-[#e9e6f7] truncate">{s.firstName} {s.lastName}</div>
                      <div className="text-[11px] text-[#aba9b9] truncate">{s.email}</div>
                    </div>
                  </button>
                );
              })}
              {students.length === 0 && (
                <p className="text-center text-[#aba9b9] text-sm py-6">No students found.</p>
              )}
            </div>
            <button
              onClick={() => setShowStudentPicker(false)}
              className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Enroll Student Modal (step 2) ─────────────────────────────── */}
      {enrollStudent && (
        <EnrollStudentModal
          student={enrollStudent}
          classes={classes}
          courses={courses}
          isLoading={isEnrolling}
          onClose={() => { setShowStudentPicker(false); setEnrollStudent(null); }}
          onEnroll={handleEnroll}
        />
      )}

      {/* ── Edit Modal ───────────────────────────────────────────────── */}
      {editTarget && (
        <EditEnrollmentModal
          enrollment={editTarget}
          classes={classes}
          courses={courses}
          isLoading={isUpdating}
          onClose={() => setEditTarget(null)}
          onSave={handleEdit}
        />
      )}

      {/* ── Delete Confirm ───────────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-sm bg-[#181826] rounded-2xl p-6 border border-[rgba(255,113,108,0.15)] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
            <div className="w-12 h-12 rounded-full bg-[rgba(255,113,108,0.12)] flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-[#ff716c]" />
            </div>
            <h3 className="text-base font-bold text-[#e9e6f7] text-center">Remove Enrollment?</h3>
            <p className="text-sm text-[#aba9b9] text-center mt-1 mb-5">
              This will permanently remove this enrollment record. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#ff716c] to-[#ff928c] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(255,113,108,0.3)] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isDeleting && <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                {isDeleting ? 'Removing…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
