'use client';

import React from 'react';
import {
  LayoutDashboard, Users, QrCode, BarChart3,
  BookOpen, Settings, ScanFace, LogOut,
} from 'lucide-react';
import type { ActivePage } from '@/components/teacher/types';

const navItems = [
  { id: 'dashboard'    as ActivePage, label: 'Dashboard',    icon: <LayoutDashboard size={18} /> },
  { id: 'classes'      as ActivePage, label: 'My Classes',   icon: <BookOpen        size={18} /> },
  { id: 'students'     as ActivePage, label: 'Students',     icon: <Users           size={18} /> },
  { id: 'qr-generator' as ActivePage, label: 'QR Generator', icon: <QrCode          size={18} /> },
  { id: 'reports'      as ActivePage, label: 'Reports',      icon: <BarChart3       size={18} /> },
];

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-[260px] shrink-0 flex flex-col bg-[#12121e] px-4 py-6 sticky top-0 h-screen overflow-y-auto border-r border-[rgba(182,160,255,0.06)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 pb-7">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff]">
          <ScanFace size={20} color="#fff" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-[#b6a0ff] to-[#68fadd] bg-clip-text text-transparent tracking-tight">
          AttendAI
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#aba9b9] px-3 py-2">Menu</span>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-[14px] py-[11px] rounded-[10px] text-sm font-medium w-full text-left transition-all duration-150 cursor-pointer border-none
              ${activePage === item.id
                ? 'bg-gradient-to-r from-[rgba(182,160,255,0.18)] to-[rgba(126,81,255,0.12)] text-[#b6a0ff] shadow-[inset_0_0_0_1px_rgba(182,160,255,0.12)]'
                : 'text-[#aba9b9] hover:bg-[#181826] hover:text-[#e9e6f7]'
              }`}
          >
            <span className="w-5 h-5 shrink-0">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#aba9b9] px-3 pt-6 pb-2">System</span>
        <button className="flex items-center gap-3 px-[14px] py-[11px] rounded-[10px] text-sm font-medium text-[#aba9b9] hover:bg-[#181826] hover:text-[#e9e6f7] transition-all w-full text-left">
          <Settings size={18} /> Settings
        </button>
        <button className="flex items-center gap-3 px-[14px] py-[11px] rounded-[10px] text-sm font-medium text-[#ff716c] hover:bg-[rgba(255,113,108,0.08)] transition-all w-full text-left">
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* Profile */}
      <div className="border-t border-[rgba(71,71,84,0.4)] pt-4 mt-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7e51ff] to-[#56ebcf] flex items-center justify-center text-sm font-bold text-white shrink-0 border-2 border-[rgba(182,160,255,0.3)]">
          SJ
        </div>
        <div>
          <div className="text-[13px] font-semibold text-[#e9e6f7]">Dr. Sarah Johnson</div>
          <div className="text-[11px] text-[#aba9b9]">Professor · CS Dept.</div>
        </div>
      </div>
    </aside>
  );
}
