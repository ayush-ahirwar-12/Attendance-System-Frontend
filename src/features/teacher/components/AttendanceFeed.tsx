"use client";

import { useState } from "react";
import { AttendanceMethod, Student } from "../types";
import { STUDENTS } from "../Data";


function MethodBadge({ method }: { method: AttendanceMethod }) {
  if (method === "face") {
    return (
      <span className="px-3 py-1 bg-secondary-fixed/30 text-on-secondary-container text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
        <span className="material-symbols-outlined text-sm">face</span>
        Face
      </span>
    );
  }
  if (method === "qr") {
    return (
      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
        <span className="material-symbols-outlined text-sm">qr_code</span>
        QR Code
      </span>
    );
  }
  return (
    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
      <span className="material-symbols-outlined text-sm">edit</span>
      Manual
    </span>
  );
}

function FeedItem({ student, index }: { student: Student; index: number }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="animate-fade-up bg-white p-4 rounded-2xl flex items-center justify-between group transition-all hover:translate-x-1 hover:shadow-sm relative"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative shrink-0">
          <img
            src={student.avatarUrl}
            alt={student.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          {student.isLive && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary border-2 border-white rounded-full animate-pulse shadow-sm" />
          )}
        </div>
        <div>
          <p style={{ fontFamily: "'Manrope', sans-serif" }} className="font-bold text-slate-900">
            {student.name}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">ID: {student.studentId}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="text-xs text-slate-400">{student.checkInTime}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {student.method && <MethodBadge method={student.method} />}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 group-hover:text-secondary transition-colors cursor-pointer hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-xl">more_vert</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 w-40 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 z-20 py-1 overflow-hidden">
              {["View Profile", "Edit Record", "Mark Absent", "Send Note"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AttendanceFeed() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <section className="col-span-8 space-y-6">
      <div className="flex justify-between items-center">
        <h4 style={{ fontFamily: "'Manrope', sans-serif" }} className="text-xl font-bold text-slate-900">
          Recent Attendance Feed
        </h4>
        <button className="text-sm font-semibold text-secondary hover:underline transition-opacity hover:opacity-80">
          View All History
        </button>
      </div>

      {/* Feed list */}
      <div className="bg-surface-container-low rounded-3xl p-4 space-y-3">
        {STUDENTS.map((student, i) => (
          <FeedItem key={student.id} student={student} index={i} />
        ))}
      </div>

      {/* AI Insight Card */}
      {!dismissed && (
        <div className="bg-secondary-fixed p-6 rounded-3xl border border-secondary/15 flex items-start space-x-5 relative overflow-hidden animate-fade-up">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-white/40 flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-secondary text-3xl icon-filled"
            >
              auto_awesome
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-black rounded uppercase tracking-tight">
                AI CURATOR
              </span>
            </div>
            <h5 style={{ fontFamily: "'Manrope', sans-serif" }} className="font-bold text-secondary mb-1">
              Pattern Detected
            </h5>
            <p className="text-sm text-on-secondary-fixed-variant">
              Student{" "}
              <strong>Elena Rodriguez</strong>{" "}
              has been late 3 times this week. AI suggests a brief check-in.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="px-5 py-2 bg-secondary text-white rounded-xl font-bold text-sm shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-transform whitespace-nowrap">
              Address
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-2 text-on-secondary-fixed-variant/60 hover:text-on-secondary-fixed-variant hover:bg-white/30 rounded-xl transition-all"
              aria-label="Dismiss"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}