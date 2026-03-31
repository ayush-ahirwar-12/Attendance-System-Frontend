"use client";

export default function StatsGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6 stagger">
      {/* Present Today */}
      <div className="animate-fade-up bg-white p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined icon-filled text-2xl">check_circle</span>
          </div>
          <span className="text-secondary text-xs font-bold bg-secondary/8 px-2.5 py-1 rounded-full">
            +4% vs yesterday
          </span>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
            Present Today
          </p>
          <h3 style={{ fontFamily: "'Manrope', sans-serif" }} className="text-3xl font-extrabold text-slate-900">
            42<span className="text-slate-400 text-lg font-medium">/50</span>
          </h3>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="animate-grow-x h-full bg-secondary rounded-full" style={{ width: "84%" }} />
        </div>
      </div>

      {/* Absent */}
      <div className="animate-fade-up bg-white p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-2xl">person_off</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
            Absent
          </p>
          <h3 style={{ fontFamily: "'Manrope', sans-serif" }} className="text-3xl font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
            5
            <span className="text-error text-xs font-bold px-2 py-1 bg-error/6 rounded-lg">
              Action Required
            </span>
          </h3>
        </div>
        <p className="text-xs text-slate-400">Average: 2.1 students</p>
      </div>

      {/* Late Arrival */}
      <div className="animate-fade-up bg-white p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-2xl">schedule</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
            Late Arrival
          </p>
          <h3 style={{ fontFamily: "'Manrope', sans-serif" }} className="text-3xl font-extrabold text-slate-900">
            3
          </h3>
        </div>
        <p className="text-xs text-slate-400">Last update: 5 mins ago</p>
      </div>

      {/* Attendance Rate */}
      <div
        className="animate-fade-up p-6 rounded-3xl shadow-sm relative overflow-hidden group cursor-default"
        style={{ background: "linear-gradient(135deg, #001736 0%, #002b5b 100%)" }}
      >
        <div className="relative z-10 space-y-4">
          <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">
            Attendance Rate
          </p>
          <div className="flex items-center space-x-4">
            <h3 style={{ fontFamily: "'Manrope', sans-serif" }} className="text-4xl font-extrabold text-white">
              84%
            </h3>
            <div className="w-14 h-14">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="3"
                />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke="#93f2f2"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="84, 100"
                  style={{ transition: "stroke-dasharray 1s ease" }}
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-white/50">Target: 95%</p>
        </div>
        {/* Decorative blob */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-secondary/15 rounded-full blur-2xl group-hover:bg-secondary/25 transition-all duration-500" />
        <div className="absolute -left-4 -top-4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
      </div>
    </section>
  );
}