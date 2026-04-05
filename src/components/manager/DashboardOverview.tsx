'use client';

import React from 'react';
import {
  BookOpen, CalendarDays, Users, TrendingUp,
  Bell, Plus,
} from 'lucide-react';
import type { ManagerPage } from './types';

interface DashboardOverviewProps {
  onNavigate: (page: ManagerPage) => void;
}

const stats = [
  {
    label: 'Total Courses',
    value: '12',
    sub: '+2 this semester',
    icon: <BookOpen size={20} />,
    iconBg: 'bg-[rgba(182,160,255,0.15)]',
    iconColor: 'text-[#b6a0ff]',
    trendColor: 'text-[#68fadd]',
    gradFrom: '#b6a0ff',
    gradTo: '#7e51ff',
  },
  {
    label: 'Active Classes',
    value: '28',
    sub: '6 running today',
    icon: <CalendarDays size={20} />,
    iconBg: 'bg-[rgba(104,250,221,0.12)]',
    iconColor: 'text-[#68fadd]',
    trendColor: 'text-[#68fadd]',
    gradFrom: '#68fadd',
    gradTo: '#00BFA5',
  },
  {
    label: 'Teachers Assigned',
    value: '8',
    sub: '2 unassigned courses',
    icon: <Users size={20} />,
    iconBg: 'bg-[rgba(129,140,248,0.12)]',
    iconColor: 'text-[#818cf8]',
    trendColor: 'text-[#ff9800]',
    gradFrom: '#818cf8',
    gradTo: '#4f46e5',
  },
  {
    label: 'Total Students',
    value: '342',
    sub: '+18 this month',
    icon: <TrendingUp size={20} />,
    iconBg: 'bg-[rgba(255,113,108,0.12)]',
    iconColor: 'text-[#ff716c]',
    trendColor: 'text-[#68fadd]',
    gradFrom: '#ff716c',
    gradTo: '#FF5252',
  },
];

const recentCourses = [
  { code: 'CS301', name: 'Algorithm Design',   teacher: 'Dr. S. Johnson', classes: 6, status: 'Active'   },
  { code: 'CS205', name: 'Data Structures',    teacher: 'Prof. R. Mehta', classes: 4, status: 'Active'   },
  { code: 'CS401', name: 'Machine Learning',   teacher: 'Unassigned',     classes: 3, status: 'Inactive' },
  { code: 'CS102', name: 'Python Programming', teacher: 'Dr. A. Sharma',  classes: 5, status: 'Active'   },
];

const StatusBadge = ({ status }: { status: string }) =>
  status === 'Active'
    ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(104,250,221,0.12)] text-[#68fadd]">● Active</span>
    : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(255,113,108,0.12)] text-[#ff716c]">● Inactive</span>;

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

export default function ManagerDashboard({ onNavigate }: DashboardOverviewProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight leading-tight">Dashboard</h1>
          <p className="text-sm text-[#aba9b9] mt-1">Welcome back, Manager 👋</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[13px] text-[#aba9b9] bg-[#181826] px-4 py-2 rounded-full">
            <span>📅</span> {today}
          </div>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1e1e2d] text-[#aba9b9] hover:text-[#e9e6f7] transition-colors">
            <Bell size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {stats.map((s) => (
          <div key={s.label} className="relative overflow-hidden bg-[#181826] rounded-xl p-6 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="absolute inset-0 opacity-[0.07] rounded-xl" style={{ background: `linear-gradient(135deg,${s.gradFrom},${s.gradTo})` }} />
            <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${s.iconBg} ${s.iconColor} mb-4`}>
              {s.icon}
            </div>
            <div className="text-[36px] font-bold text-[#e9e6f7] tracking-tight leading-none">{s.value}</div>
            <div className="text-xs text-[#aba9b9] font-medium mt-1">{s.label}</div>
            <div className={`text-[11px] mt-2 font-medium ${s.trendColor}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Bottom: table + Quick Actions */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 260px' }}>
        {/* Recent Courses */}
        <div className="bg-[#181826] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-base font-semibold text-[#e9e6f7]">Recent Courses</div>
              <div className="text-xs text-[#aba9b9] mt-0.5">Semester overview</div>
            </div>
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-[rgba(71,71,84,0.4)] text-[#e9e6f7] hover:bg-[#1e1e2d] transition-colors"
            >
              View All
            </button>
          </div>

          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr>
                {['Code', 'Course Name', 'Teacher', 'Classes', 'Status'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9] px-3.5 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentCourses.map((c) => (
                <tr key={c.code} className="bg-[#12121e] hover:bg-[#1e1e2d] transition-colors cursor-pointer">
                  <td className="px-3.5 py-3 rounded-l-lg">
                    <span className="font-semibold text-[#b6a0ff] text-sm">{c.code}</span>
                  </td>
                  <td className="px-3.5 py-3 text-[13px] text-[#e9e6f7]">{c.name}</td>
                  <td className="px-3.5 py-3 text-[13px] text-[#aba9b9]">{c.teacher}</td>
                  <td className="px-3.5 py-3 text-[13px] text-[#aba9b9]">{c.classes} classes</td>
                  <td className="px-3.5 py-3 rounded-r-lg"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          <div className="bg-[#181826] rounded-xl p-5">
            <div className="text-sm font-semibold text-[#e9e6f7] mb-4">Quick Actions</div>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => onNavigate('courses')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all"
              >
                <Plus size={15} /> Add Course
              </button>
              <button
                onClick={() => onNavigate('classes')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-[#003830] bg-gradient-to-r from-[#68fadd] to-[#56ebcf] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(104,250,221,0.25)] transition-all"
              >
                <CalendarDays size={15} /> Create Class
              </button>
              <button
                onClick={() => onNavigate('reports')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-[#e9e6f7] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] transition-colors"
              >
                View Reports
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-[#181826] rounded-xl p-5">
            <div className="text-sm font-semibold text-[#e9e6f7] mb-4">Quick Summary</div>
            {[
              { label: 'Active Courses',  count: 10, color: '#68fadd' },
              { label: 'Inactive',        count: 2,  color: '#ff716c' },
              { label: 'Unassigned',      count: 2,  color: '#ff9800' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center mb-2.5">
                <span className="text-sm text-[#aba9b9]">{item.label}</span>
                <span className="text-[17px] font-bold" style={{ color: item.color }}>{item.count}</span>
              </div>
            ))}
            <div className="border-t border-[rgba(71,71,84,0.4)] pt-3 mt-1 flex justify-between">
              <span className="text-sm text-[#aba9b9]">Total</span>
              <span className="text-base font-bold text-[#e9e6f7]">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
