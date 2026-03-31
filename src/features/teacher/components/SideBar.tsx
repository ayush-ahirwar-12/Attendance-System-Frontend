"use client";

import Link from "next/link";
import { NavItem } from "../types";
import { BOTTOM_NAV, NAV_ITEMS } from "../Data";


function NavLink({ item }: { item: NavItem }) {
  if (item.active) {
    return (
      <Link
        href={item.href}
        className="flex items-center space-x-3 p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-lg shadow-slate-900/20 transition-all duration-200"
      >
        <span className="material-symbols-outlined">{item.icon}</span>
        <span style={{ fontFamily: "'Manrope', sans-serif" }} className="font-semibold tracking-wide">
          {item.label}
        </span>
      </Link>
    );
  }
  return (
    <Link
      href={item.href}
      className="flex items-center space-x-3 p-4 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded-2xl transition-all duration-200 hover:translate-x-1 group"
    >
      <span className="material-symbols-outlined group-hover:scale-110 transition-transform duration-200">
        {item.icon}
      </span>
      <span style={{ fontFamily: "'Manrope', sans-serif" }} className="font-semibold tracking-wide">
        {item.label}
      </span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-slate-100 flex flex-col p-6 space-y-8 rounded-r-3xl shadow-2xl shadow-slate-900/5 z-50 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center space-x-4 px-2 pt-2">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20 shrink-0"
          style={{ background: "linear-gradient(135deg, #001736 0%, #002b5b 100%)" }}
        >
          <span className="material-symbols-outlined text-3xl">school</span>
        </div>
        <div>
          <h1
            style={{ fontFamily: "'Manrope', sans-serif" }}
            className="text-lg font-black text-slate-900 leading-tight"
          >
            Intelligent Registrar
          </h1>
          <p
            style={{ fontFamily: "'Manrope', sans-serif" }}
            className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase"
          >
            Teacher Portal
          </p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.label} item={item} />
        ))}
      </nav>

      {/* Class info chip */}
      <div className="mx-2 p-4 rounded-2xl bg-white shadow-sm border border-slate-200/60">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          Active Class
        </p>
        <p style={{ fontFamily: "'Manrope', sans-serif" }} className="font-bold text-slate-800 text-sm leading-snug">
          CS101: Intro to Web Design
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs text-secondary font-semibold">Session live</span>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="pt-4 border-t border-slate-200 space-y-1">
        {BOTTOM_NAV.map((item) => (
          <NavLink key={item.label} item={item} />
        ))}
      </div>
    </aside>
  );
}