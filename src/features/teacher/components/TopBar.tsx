"use client";

import { useState } from "react";

export default function TopBar() {
  const [query, setQuery] = useState("");

  return (
    <header
      className="sticky top-0 w-full flex justify-between items-center px-10 h-20 z-40 border-b border-slate-200/60"
      style={{ background: "rgba(248,249,250,0.85)", backdropFilter: "blur(20px)" }}
    >
      {/* Left */}
      <div className="flex items-center space-x-8">
        <h2
          style={{ fontFamily: "'Manrope', sans-serif" }}
          className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap"
        >
          Dashboard Overview
        </h2>
        <div className="relative w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
            search
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-200/60 rounded-xl border-none focus:outline-none focus:ring-2 text-sm placeholder:text-slate-400"
            style={{ fontFamily: "'Inter', sans-serif" }}
            placeholder="Search students, classes, or logs…"
            type="text"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button className="relative p-2.5 text-slate-500 hover:bg-slate-200/60 rounded-xl transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-white" />
        </button>

        {/* History */}
        <button className="p-2.5 text-slate-500 hover:bg-slate-200/60 rounded-xl transition-colors">
          <span className="material-symbols-outlined">history_edu</span>
        </button>

        {/* Divider + Profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p
              style={{ fontFamily: "'Manrope', sans-serif" }}
              className="text-sm font-bold text-slate-900"
            >
              Dr. Sarah Jenkins
            </p>
            <p className="text-xs text-slate-500">Computer Science Dept.</p>
          </div>
          <div className="w-10 h-10 rounded-full ring-2 ring-secondary/20 overflow-hidden shrink-0 bg-slate-200">
            <img
              src="https://i.pravatar.cc/40?img=47"
              alt="Dr. Sarah Jenkins"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}