'use client';

import React from 'react';
import {
  LayoutDashboard, BookOpen, CalendarDays,
  BarChart3, Settings, ScanFace,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/config/store';
import Logout from '@/features/auth/components/Logout';


type User={
  firstName:string;
  role:string
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard',  icon: <LayoutDashboard size={18} />, href: '/manager' },
  { id: 'courses',   label: 'Courses',    icon: <BookOpen        size={18} />, href: '/manager/courses' },
  { id: 'classes',   label: 'Classes',    icon: <CalendarDays    size={18} />, href: '/manager/classes' },
  { id: 'reports',   label: 'Reports',    icon: <BarChart3       size={18} />, href: '/manager/reports' },
  { id: 'users',     label: 'Users',      icon: <Users           size={18} />, href: '/manager/user' },
];

export default function ManagerSidebar({ user }: { user: User }) {
  // const {user} = useSelector((state:RootState)=>state.auth);
  const pathname = usePathname();

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

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-[14px] py-[11px] rounded-[10px] text-sm font-medium w-full text-left transition-all duration-150 cursor-pointer border-none
                ${isActive
                  ? 'bg-gradient-to-r from-[rgba(182,160,255,0.18)] to-[rgba(126,81,255,0.12)] text-[#b6a0ff] shadow-[inset_0_0_0_1px_rgba(182,160,255,0.12)]'
                  : 'text-[#aba9b9] hover:bg-[#181826] hover:text-[#e9e6f7]'
                }`}
            >
              <span className="w-5 h-5 shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#aba9b9] px-3 pt-6 pb-2">System</span>
        <button className="flex items-center gap-3 px-[14px] py-[11px] rounded-[10px] text-sm font-medium text-[#aba9b9] hover:bg-[#181826] hover:text-[#e9e6f7] transition-all w-full text-left">
          <Settings size={18} /> Settings
        </button>


        {/* <button className="flex items-center gap-3 px-[14px] py-[11px] rounded-[10px] text-sm font-medium text-[#ff716c] hover:bg-[rgba(255,113,108,0.08)] transition-all w-full text-left">
          <LogOut size={18} /> Logout
        </button> */}

        <div>
          <Logout/>
        </div>


      </nav>

      {/* Profile */}
      <div className="border-t border-[rgba(71,71,84,0.4)] pt-4 mt-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7e51ff] to-[#56ebcf] flex items-center justify-center text-sm font-bold text-white shrink-0 border-2 border-[rgba(182,160,255,0.3)]">
          {user?.firstName?.substring(0, 2).toUpperCase() || 'MR'}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-[#e9e6f7]">{user?.firstName}</div>
          <div className="text-[11px] text-[#aba9b9]">{user?.role}</div>
        </div>
      </div>
    </aside>
  );
}
