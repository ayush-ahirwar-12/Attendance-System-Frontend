"use client";

import { useState } from "react";
import { SCHEDULE } from "../Data";

function QuickActionButton({
  icon,
  title,
  sub,
  gradient,
  shadowColor,
}: {
  icon: string;
  title: string;
  sub: string;
  gradient: string;
  shadowColor: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      className="group w-full p-1 rounded-3xl overflow-hidden transition-all active:scale-95"
      style={{
        background: gradient,
        boxShadow: `0 8px 24px ${shadowColor}`,
      }}
    >
      <div className="flex items-center p-5 bg-white/5 rounded-[1.4rem] space-x-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
          {loading ? (
            <span className="material-symbols-outlined text-2xl animate-spin" style={{ animationDuration: "0.8s" }}>
              progress_activity
            </span>
          ) : (
            <span className="material-symbols-outlined text-3xl">{icon}</span>
          )}
        </div>
        <div className="text-left">
          <p style={{ fontFamily: "'Manrope', sans-serif" }} className="text-white font-bold text-lg leading-tight">
            {title}
          </p>
          <p className="text-white/60 text-xs mt-0.5">{sub}</p>
        </div>
        <span className="material-symbols-outlined text-white/20 group-hover:text-white/80 ml-auto transition-all group-hover:translate-x-1 duration-200">
          arrow_forward_ios
        </span>
      </div>
    </button>
  );
}

export default function RightPanel() {
  return (
    <section className="col-span-4 space-y-10">
      {/* Quick Actions */}
      <div className="space-y-5">
        <h4 style={{ fontFamily: "'Manrope', sans-serif" }} className="text-xl font-bold text-slate-900">
          Quick Actions
        </h4>
        <div className="space-y-4">
          <QuickActionButton
            icon="photo_camera"
            title="Start Face Scan"
            sub="AI-powered recognition"
            gradient="linear-gradient(135deg, #001736 0%, #002b5b 100%)"
            shadowColor="rgba(0,23,54,0.25)"
          />
          <QuickActionButton
            icon="qr_code_2"
            title="Generate Class QR"
            sub="Dynamic session QR"
            gradient="linear-gradient(135deg, #006a6a 0%, #004f4f 100%)"
            shadowColor="rgba(0,106,106,0.25)"
          />
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="space-y-5">
        <h4 style={{ fontFamily: "'Manrope', sans-serif" }} className="text-xl font-bold text-slate-900">
          Today&apos;s Schedule
        </h4>
        <div className="bg-surface-container-low rounded-3xl p-5 relative overflow-hidden">
          <div className="space-y-5 relative z-10">
            {SCHEDULE.map((session, i) => (
              <div
                key={i}
                className={`pl-4 py-1 transition-opacity ${
                  session.isCurrent
                    ? "border-l-4 border-secondary"
                    : i === 1
                    ? "border-l-4 border-slate-300 opacity-60"
                    : "border-l-4 border-slate-200 opacity-40"
                }`}
              >
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
                    session.isCurrent ? "text-secondary" : "text-slate-400"
                  }`}
                >
                  {session.isCurrent ? "Current Session" : i === 1 ? "Next Session" : "Later"}
                </p>
                <h5
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                  className={`font-extrabold leading-tight text-sm ${
                    session.isCurrent ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  {session.title}
                </h5>
                <p className="text-xs text-slate-400 mt-0.5">
                  {session.time} • {session.location}
                </p>
              </div>
            ))}
          </div>
          {/* Accent blob */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-surface-container rounded-full blur-3xl opacity-60 pointer-events-none" />
        </div>
      </div>

      {/* Live Hub Activity */}
      <div className="bg-surface-container-highest/40 p-5 rounded-3xl">
        <div className="flex items-center space-x-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-bold text-secondary uppercase tracking-wide">
            Live Hub Activity
          </span>
        </div>
        <div className="space-y-3">
          {[
            { src: "https://i.pravatar.cc/32?img=51", name: "Leo K.", action: "entered via Face ID" },
            { src: "https://i.pravatar.cc/32?img=44", name: "Mia W.", action: "verified QR at Gate B" },
            { src: "https://i.pravatar.cc/32?img=23", name: "Raj P.", action: "marked present manually" },
          ].map((item) => (
            <div key={item.name} className="flex items-center space-x-3 group">
              <img
                src={item.src}
                alt={item.name}
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-transparent group-hover:ring-secondary/20 transition-all"
              />
              <p className="text-xs text-slate-500 leading-snug">
                <span className="font-bold text-slate-700">{item.name}</span>{" "}
                {item.action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}