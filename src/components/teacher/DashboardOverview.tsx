'use client';

import React from 'react';
import {
  Users, CheckCircle2, XCircle, BarChart3,
  Eye, QrCode, Bell, TrendingUp, TrendingDown,
} from 'lucide-react';
import type { ActivePage } from '@/components/teacher/types';

interface DashboardOverviewProps {
  onNavigate: (page: ActivePage) => void;
}

const classes = [
  { code: 'CS301', name: 'Algorithm Design',   time: '9:00 AM',  room: 'Room 201', present: 38, total: 40, pct: 95,  status: 'Completed'   },
  { code: 'CS205', name: 'Data Structures',    time: '11:00 AM', room: 'Room 105', present: 32, total: 38, pct: 84,  status: 'Completed'   },
  { code: 'CS401', name: 'Machine Learning',   time: '2:00 PM',  room: 'Room 301', present: 28, total: 40, pct: 70,  status: 'In Progress' },
  { code: 'CS102', name: 'Python Programming', time: '4:00 PM',  room: 'Room 202', present: null, total: 35, pct: null, status: 'Upcoming' },
  { code: 'CS303', name: 'Computer Networks',  time: '6:00 PM',  room: 'Room 404', present: null, total: 42, pct: null, status: 'Upcoming' },
];

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'Completed')
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(104,250,221,0.12)] text-[#68fadd]">✓ Completed</span>;
  if (status === 'In Progress')
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(182,160,255,0.12)] text-[#b6a0ff]">● In Progress</span>;
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(171,169,185,0.12)] text-[#aba9b9]">○ Upcoming</span>;
};

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight leading-tight">Dashboard</h1>
          <p className="text-sm text-[#aba9b9] mt-1">Welcome back, Dr. Johnson 👋</p>
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

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {/* Total Students */}
        <div className="relative overflow-hidden bg-[#181826] rounded-xl p-6 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="absolute inset-0 opacity-[0.07] bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] rounded-xl" />
          <div className="w-11 h-11 rounded-[10px] flex items-center justify-center bg-[rgba(182,160,255,0.15)] text-[#b6a0ff] mb-4">
            <Users size={20} />
          </div>
          <div className="text-[36px] font-bold text-[#e9e6f7] tracking-tight leading-none">142</div>
          <div className="text-xs text-[#aba9b9] font-medium mt-1">Total Students</div>
          <div className="text-[11px] text-[#68fadd] mt-2 font-medium flex items-center gap-1"><TrendingUp size={12} />+6 this semester</div>
        </div>

        {/* Present Today */}
        <div className="relative overflow-hidden bg-[#181826] rounded-xl p-6 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="absolute inset-0 opacity-[0.07] bg-gradient-to-br from-[#68fadd] to-[#00BFA5] rounded-xl" />
          <div className="w-11 h-11 rounded-[10px] flex items-center justify-center bg-[rgba(104,250,221,0.12)] text-[#68fadd] mb-4">
            <CheckCircle2 size={20} />
          </div>
          <div className="text-[36px] font-bold text-[#e9e6f7] tracking-tight leading-none">118</div>
          <div className="text-xs text-[#aba9b9] font-medium mt-1">Present Today</div>
          <div className="text-[11px] text-[#68fadd] mt-2 font-medium flex items-center gap-1"><TrendingUp size={12} />83% avg rate</div>
        </div>

        {/* Absent Today */}
        <div className="relative overflow-hidden bg-[#181826] rounded-xl p-6 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="absolute inset-0 opacity-[0.07] bg-gradient-to-br from-[#ff716c] to-[#FF5252] rounded-xl" />
          <div className="w-11 h-11 rounded-[10px] flex items-center justify-center bg-[rgba(255,113,108,0.12)] text-[#ff716c] mb-4">
            <XCircle size={20} />
          </div>
          <div className="text-[36px] font-bold text-[#e9e6f7] tracking-tight leading-none">24</div>
          <div className="text-xs text-[#aba9b9] font-medium mt-1">Absent Today</div>
          <div className="text-[11px] text-[#ff716c] mt-2 font-medium flex items-center gap-1"><TrendingDown size={12} />-3 vs yesterday</div>
        </div>

        {/* Avg Attendance */}
        <div className="relative overflow-hidden bg-[#181826] rounded-xl p-6 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="absolute inset-0 opacity-[0.07] bg-gradient-to-br from-[#818cf8] to-[#4f46e5] rounded-xl" />
          <div className="w-11 h-11 rounded-[10px] flex items-center justify-center bg-[rgba(129,140,248,0.12)] text-[#818cf8] mb-4">
            <BarChart3 size={20} />
          </div>
          <div className="text-[36px] font-bold text-[#e9e6f7] tracking-tight leading-none">83%</div>
          <div className="text-xs text-[#aba9b9] font-medium mt-1">Avg Attendance</div>
          <div className="text-[11px] text-[#68fadd] mt-2 font-medium flex items-center gap-1"><TrendingUp size={12} />+2% this month</div>
        </div>
      </div>

      {/* Bottom: Table + Quick actions */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 280px' }}>
        {/* Classes Table */}
        <div className="bg-[#181826] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-base font-semibold text-[#e9e6f7]">Today's Classes</div>
              <div className="text-xs text-[#aba9b9] mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <button className="text-xs font-semibold px-4 py-2 rounded-lg border border-[rgba(71,71,84,0.4)] text-[#e9e6f7] hover:bg-[#1e1e2d] transition-colors">
              View All
            </button>
          </div>

          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr>
                {['Class', 'Time', 'Room', 'Students', 'Attendance', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9] px-3.5 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => {
                const pctColor = cls.pct && cls.pct >= 80 ? '#68fadd' : cls.pct && cls.pct >= 60 ? '#ff9800' : '#ff716c';
                const pctGrad  = cls.pct && cls.pct >= 80
                  ? 'linear-gradient(90deg,#56ebcf,#68fadd)'
                  : cls.pct && cls.pct >= 60
                  ? 'linear-gradient(90deg,#ff9800,#ffb74d)'
                  : 'linear-gradient(90deg,#ff716c,#ff928c)';
                return (
                  <tr key={cls.code} className="bg-[#12121e] hover:bg-[#1e1e2d] transition-colors cursor-pointer rounded-lg">
                    <td className="px-3.5 py-3 rounded-l-lg">
                      <div className="font-semibold text-[#b6a0ff] text-sm">{cls.code}</div>
                      <div className="text-[11px] text-[#aba9b9] mt-0.5">{cls.name}</div>
                    </td>
                    <td className="px-3.5 py-3 text-[13px] text-[#aba9b9]">{cls.time}</td>
                    <td className="px-3.5 py-3 text-[13px] text-[#aba9b9]">{cls.room}</td>
                    <td className="px-3.5 py-3 text-[13.5px]">
                      {cls.present !== null
                        ? <><span className="font-semibold">{cls.present}</span><span className="text-[#aba9b9]">/{cls.total}</span></>
                        : <span className="text-[#aba9b9]">—</span>}
                    </td>
                    <td className="px-3.5 py-3">
                      {cls.pct !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-[#242434] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${cls.pct}%`, background: pctGrad }} />
                          </div>
                          <span className="text-xs font-semibold min-w-[32px] text-right" style={{ color: pctColor }}>{cls.pct}%</span>
                        </div>
                      ) : <span className="text-[#aba9b9]">—</span>}
                    </td>
                    <td className="px-3.5 py-3"><StatusBadge status={cls.status} /></td>
                    <td className="px-3.5 py-3 rounded-r-lg">
                      <div className="flex gap-1.5">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e1e2d] text-[#aba9b9] hover:text-[#e9e6f7] transition-colors"><Eye size={14} /></button>
                        <button onClick={() => onNavigate('qr-generator')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[rgba(182,160,255,0.12)] text-[#b6a0ff] hover:scale-105 transition-transform"><QrCode size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-3">
          {/* Quick Actions */}
          <div className="bg-[#181826] rounded-xl p-5">
            <div className="text-sm font-semibold text-[#e9e6f7] mb-4">Quick Actions</div>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => onNavigate('qr-generator')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all"
              >
                <QrCode size={15} /> Generate QR Code
              </button>
              <button
                onClick={() => onNavigate('students')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-[#003830] bg-gradient-to-r from-[#68fadd] to-[#56ebcf] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(104,250,221,0.25)] transition-all"
              >
                <CheckCircle2 size={15} /> Take Attendance
              </button>
              <button
                onClick={() => onNavigate('reports')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-[#e9e6f7] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] transition-colors"
              >
                <BarChart3 size={15} /> View Reports
              </button>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-[#181826] rounded-xl p-5">
            <div className="text-sm font-semibold text-[#e9e6f7] mb-4">Today's Summary</div>
            {[
              { label: 'Completed',   count: 2, color: '#68fadd' },
              { label: 'In Progress', count: 1, color: '#b6a0ff' },
              { label: 'Upcoming',    count: 2, color: '#aba9b9' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center mb-2.5">
                <span className="text-sm text-[#aba9b9]">{item.label}</span>
                <span className="text-[17px] font-bold" style={{ color: item.color }}>{item.count}</span>
              </div>
            ))}
            <div className="border-t border-[rgba(71,71,84,0.4)] pt-3 mt-1 flex justify-between">
              <span className="text-sm text-[#aba9b9]">Total Classes</span>
              <span className="text-base font-bold text-[#e9e6f7]">5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
