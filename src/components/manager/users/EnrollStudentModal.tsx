'use client';

import React, { useState } from 'react';
import { X, GraduationCap } from 'lucide-react';
import type { User } from './types';

type EnrollmentStatus = 'active' | 'dropped' | 'completed';

interface EnrollStudentModalProps {
  student: User;
  classes: { _id: string; section: string; name: string }[];
  courses: { _id: string; code: string; name: string; type: 'compulsory' | 'elective' }[];
  isLoading?: boolean;
  onClose: () => void;
  onEnroll: (payload: {
    student: string;
    classId: string;
    courseId?: string | null;
    status: EnrollmentStatus;
  }) => void;
}

const STATUS_OPTIONS: {
  value: EnrollmentStatus;
  label: string;
  color: string;
  bg: string;
  activeBg: string;
}[] = [
    { value: 'active', label: 'Active', color: '#68fadd', bg: 'rgba(104,250,221,0.08)', activeBg: 'rgba(104,250,221,0.18)' },
    { value: 'dropped', label: 'Dropped', color: '#ff716c', bg: 'rgba(255,113,108,0.08)', activeBg: 'rgba(255,113,108,0.18)' },
    { value: 'completed', label: 'Completed', color: '#b6a0ff', bg: 'rgba(182,160,255,0.08)', activeBg: 'rgba(182,160,255,0.18)' },
  ];

export default function EnrollStudentModal({
  student,
  classes,
  courses,
  isLoading,
  onClose,
  onEnroll,
}: EnrollStudentModalProps) {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');   // '' = no optional course
  const [status, setStatus] = useState<EnrollmentStatus>('active');

  const initials = `${student.firstName?.charAt(0) ?? ''}${student.lastName?.charAt(0) ?? ''}`.toUpperCase();

  const handleSubmit = () => {
    if (!selectedClass) return;
    onEnroll({
      student: student._id,
      classId: selectedClass,
      courseId: selectedCourse || null,
      status,
    });
  };

  const inputCls =
    'w-full bg-[#12121e] border border-[rgba(71,71,84,0.3)] rounded-lg px-3 py-2.5 text-sm text-[#e9e6f7] focus:outline-none focus:border-[rgba(104,250,221,0.4)] focus:bg-[#0d0d18] transition-all';
  const labelCls = 'block text-[10px] font-semibold tracking-widest uppercase text-[#aba9b9] mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#181826] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.7)] border border-[rgba(71,71,84,0.3)] overflow-hidden">
        {/* Top gradient bar */}
        <div
          className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg,#b6a0ff,#68fadd)' }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[rgba(71,71,84,0.25)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[rgba(182,160,255,0.2)] to-[rgba(104,250,221,0.1)] border border-[rgba(182,160,255,0.2)]">
              <GraduationCap size={17} className="text-[#b6a0ff]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#e9e6f7] leading-none">Enroll Student</h2>
              <p className="text-[11px] text-[#aba9b9] mt-0.5">Assign this student to a class section</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e1e2d] text-[#aba9b9] hover:text-[#e9e6f7] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Student info card */}
          <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-[#12121e] border border-[rgba(71,71,84,0.25)]">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7e51ff] to-[#56ebcf] flex items-center justify-center text-[13px] font-bold text-white shrink-0 border-2 border-[rgba(182,160,255,0.25)]">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#e9e6f7] truncate">
                {student.firstName} {student.lastName}
              </div>
              <div className="text-[11px] text-[#aba9b9] truncate">{student.email}</div>
            </div>
            <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgba(104,250,221,0.12)] text-[#68fadd] border border-[rgba(104,250,221,0.2)] uppercase tracking-wider">
              Student
            </span>
          </div>

          {/* Class selector (required) */}
          <div>
            <label className={labelCls}>
              Class Section <span className="text-[#ff716c]">*</span>
            </label>
            <select
              className={inputCls}
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
            >
              <option value="" style={{ background: '#12121e' }}>— Choose a class section —</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id} style={{ background: '#12121e' }}>
                  Section {cls.section}{cls.name ? ` (${cls.name})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Course selector (optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelCls + ' mb-0'}>Elective Course <span className="text-[#aba9b9] font-normal normal-case tracking-normal">(optional)</span></label>
              <span className="text-[10px] text-[#aba9b9] italic">Only for elective enrollment</span>
            </div>
            <select
              className={inputCls}
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
            >
              <option value="" style={{ background: '#12121e' }}>— None (compulsory class enrollment) —</option>
              {courses.filter(c => c.type === 'elective').map(course => (
                <option key={course._id} value={course._id} style={{ background: '#12121e' }}>
                  {course.code} – {course.name}
                </option>
              ))}
            </select>
            {selectedCourse && (
              <p className="text-[10px] text-[#ffd966] mt-1">
                ✦ Elective course enrollment — student will be linked to this specific elective.
              </p>
            )}
            {courses.filter(c => c.type === 'elective').length === 0 && (
              <p className="text-[10px] text-[#aba9b9] mt-1">No elective courses available.</p>
            )}
          </div>

          {/* Status selector */}
          <div>
            <label className={labelCls}>Enrollment Status</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className="flex-1 py-2 rounded-full text-xs font-semibold border transition-all duration-150"
                  style={{
                    color: opt.color,
                    background: status === opt.value ? opt.activeBg : opt.bg,
                    borderColor: status === opt.value ? opt.color : 'rgba(71,71,84,0.3)',
                    boxShadow: status === opt.value ? `0 0 12px ${opt.color}30` : 'none',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-1 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedClass || isLoading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#0d0d18] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-px hover:shadow-[0_10px_30px_rgba(104,250,221,0.25)]"
            style={{ background: 'linear-gradient(135deg,#b6a0ff,#68fadd)' }}
          >
            {isLoading ? 'Enrolling…' : 'Enroll Student'}
          </button>
        </div>
      </div>
    </div>
  );
}
