'use client';

import React from 'react';
import { BarChart3, TrendingUp, Users, BookOpen, CalendarDays } from 'lucide-react';
import { INITIAL_COURSES, INITIAL_CLASSES, STUDENTS, TEACHERS } from './mockData';

const StatCard = ({ icon, label, value, color, bg }: {
  icon: React.ReactNode; label: string; value: string | number; color: string; bg: string;
}) => (
  <div className={`relative overflow-hidden bg-[#181826] rounded-xl p-6 hover:-translate-y-0.5 transition-transform`}>
    <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${bg} ${color} mb-4`}>{icon}</div>
    <div className="text-[32px] font-bold text-[#e9e6f7] tracking-tight">{value}</div>
    <div className="text-xs text-[#aba9b9] font-medium mt-1">{label}</div>
  </div>
);

export default function ReportsPage() {
  const activeCourses   = INITIAL_COURSES.filter(c => c.status === 'Active').length;
  const assignedTeachers = new Set(INITIAL_COURSES.map(c => c.teacherId).filter(Boolean)).size;
  const totalStudents   = STUDENTS.length;
  const totalClasses    = INITIAL_CLASSES.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight">Reports</h1>
        <p className="text-sm text-[#aba9b9] mt-1">Semester-wide overview and statistics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard icon={<BookOpen size={20} />}     label="Active Courses"    value={activeCourses}    color="text-[#b6a0ff]" bg="bg-[rgba(182,160,255,0.12)]" />
        <StatCard icon={<CalendarDays size={20} />} label="Total Classes"     value={totalClasses}     color="text-[#68fadd]" bg="bg-[rgba(104,250,221,0.12)]"  />
        <StatCard icon={<Users size={20} />}        label="Teachers Assigned" value={assignedTeachers} color="text-[#818cf8]" bg="bg-[rgba(129,140,248,0.12)]"  />
        <StatCard icon={<TrendingUp size={20} />}   label="Total Students"    value={totalStudents}    color="text-[#ff9800]" bg="bg-[rgba(255,152,0,0.12)]"     />
      </div>

      {/* Course breakdown */}
      <div className="bg-[#181826] rounded-xl p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <BarChart3 size={18} className="text-[#b6a0ff]" />
          <div className="text-base font-semibold text-[#e9e6f7]">Course Breakdown</div>
        </div>
        <div className="space-y-3">
          {INITIAL_COURSES.map(course => {
            const teacher = TEACHERS.find(t => t.id === course.teacherId);
            const classCount = INITIAL_CLASSES.filter(cl => cl.courseId === course.id).length;
            const studentCount = new Set(
              INITIAL_CLASSES.filter(cl => cl.courseId === course.id).flatMap(cl => cl.studentIds)
            ).size;

            return (
              <div key={course.id} className="bg-[#12121e] rounded-lg px-4 py-3 flex items-center gap-4">
                <div className="w-16 shrink-0">
                  <span className="text-xs font-bold font-mono text-[#b6a0ff]">{course.code}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#e9e6f7] truncate">{course.name}</div>
                  <div className="text-[11px] text-[#aba9b9]">{teacher ? teacher.name : 'Unassigned'}</div>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div>
                    <div className="text-xs font-bold text-[#68fadd]">{classCount}</div>
                    <div className="text-[10px] text-[#aba9b9] uppercase tracking-wide">Classes</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#b6a0ff]">{studentCount}</div>
                    <div className="text-[10px] text-[#aba9b9] uppercase tracking-wide">Students</div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      course.status === 'Active'
                        ? 'bg-[rgba(104,250,221,0.12)] text-[#68fadd]'
                        : 'bg-[rgba(255,113,108,0.12)] text-[#ff716c]'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teachers */}
      <div className="bg-[#181826] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <Users size={18} className="text-[#68fadd]" />
          <div className="text-base font-semibold text-[#e9e6f7]">Teacher Assignments</div>
        </div>
        <table className="w-full border-separate border-spacing-y-1">
          <thead>
            <tr>
              {['Teacher', 'Dept.', 'Assigned Course', 'Classes', 'Students'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9] px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TEACHERS.map(teacher => {
              const assignedCourses = INITIAL_COURSES.filter(c => c.teacherId === teacher.id);
              const classCount = INITIAL_CLASSES.filter(cl => assignedCourses.some(c => c.id === cl.courseId)).length;
              const studentCount = new Set(
                INITIAL_CLASSES.filter(cl => assignedCourses.some(c => c.id === cl.courseId)).flatMap(cl => cl.studentIds)
              ).size;

              return (
                <tr key={teacher.id} className="bg-[#12121e] hover:bg-[#1e1e2d] transition-colors">
                  <td className="px-3 py-3 rounded-l-lg">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7e51ff] to-[#56ebcf] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                        {teacher.initials}
                      </div>
                      <span className="text-[13px] font-medium text-[#e9e6f7]">{teacher.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-[#242434] text-[#aba9b9]">{teacher.department}</span>
                  </td>
                  <td className="px-3 py-3 text-[13px] text-[#aba9b9]">
                    {assignedCourses.length > 0 ? assignedCourses.map(c => c.code).join(', ') : <span className="text-[#ff716c] italic">None</span>}
                  </td>
                  <td className="px-3 py-3 text-[13px] font-semibold text-[#68fadd]">{classCount}</td>
                  <td className="px-3 py-3 rounded-r-lg text-[13px] font-semibold text-[#b6a0ff]">{studentCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
