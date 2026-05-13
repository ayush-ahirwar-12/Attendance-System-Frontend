"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Plus, X, CalendarDays, CheckCircle2, PlayCircle } from "lucide-react";
import { useSemesters, useCreateSemester, useUpdateSemesterStatus } from "@/features/semester/hooks/useSemesterApi";
import { CreateSemesterPayload, Semester } from "@/features/semester/types";

const inputCls = 'w-full bg-[#12121e] border border-[rgba(71,71,84,0.3)] rounded-lg px-3 py-2.5 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:border-[rgba(182,160,255,0.4)] focus:bg-[#0d0d18] transition-all';
const labelCls = 'block text-[10px] font-semibold tracking-widest uppercase text-[#aba9b9] mb-1.5';

export default function SemesterPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: fetchedSemesters, isLoading } = useSemesters();
  
  const semesters: Semester[] = useMemo(() => {
    if (!fetchedSemesters) return [];
    if (Array.isArray(fetchedSemesters)) return fetchedSemesters;
    // Handle wrapped response formats
    if ((fetchedSemesters as any).data && Array.isArray((fetchedSemesters as any).data)) return (fetchedSemesters as any).data;
    if ((fetchedSemesters as any).semesters && Array.isArray((fetchedSemesters as any).semesters)) return (fetchedSemesters as any).semesters;
    return [];
  }, [fetchedSemesters]);

  const { mutate: createSemester, isPending } = useCreateSemester();
  const { mutate: updateStatus } = useUpdateSemesterStatus();
  const { register, handleSubmit, reset } = useForm<CreateSemesterPayload>();

  const onSubmit = (data: CreateSemesterPayload) => {
    createSemester(data, {
      onSuccess: () => { setShowForm(false); reset(); }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgba(182,160,255,1)]"></div>
        <span className="ml-3 text-[#aba9b9] text-sm font-medium tracking-wide">Loading semesters...</span>
      </div>
    );
  }

  const activeSemesters = semesters.filter(s => s.status === 'active').length;
  const upcomingSemesters = semesters.filter(s => s.status === 'upcoming').length;
  const totalSemesters = semesters.length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight">Semesters</h1>
          <p className="text-sm text-[#aba9b9] mt-1">Manage academic semesters and their active statuses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all"
        >
          <Plus size={15} /> Create Semester
        </button>
      </div>

      {/* Stats chips */}
      <div className="flex gap-3 mb-5">
        {[
          { label: 'Total Semesters', value: totalSemesters, color: 'text-[#e9e6f7]' },
          { label: 'Active', value: activeSemesters, color: 'text-[#68fadd]' },
          { label: 'Upcoming', value: upcomingSemesters, color: 'text-[#b6a0ff]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#181826] rounded-lg px-5 py-2.5 flex items-center gap-2.5">
            <span className={`text-xl font-bold ${color}`}>{value}</span>
            <span className="text-xs text-[#aba9b9]">{label}</span>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md bg-[#181826] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] border border-[rgba(182,160,255,0.08)] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[rgba(71,71,84,0.3)]">
              <div>
                <h2 className="text-base font-bold text-[#e9e6f7]">New Semester</h2>
                <p className="text-xs text-[#aba9b9] mt-0.5">Define a new academic term</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e1e2d] text-[#aba9b9] hover:text-[#e9e6f7] transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 py-5 flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Semester Name</label>
                  <input
                    {...register("name", { required: true })}
                    placeholder="e.g. Sem 5 - 2024"
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Start Date</label>
                    <input
                      type="date"
                      {...register("startDate", { required: true })}
                      className={inputCls}
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>End Date</label>
                    <input
                      type="date"
                      {...register("endDate", { required: true })}
                      className={inputCls}
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 pb-6 pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  {isPending && <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />}
                  {isPending ? "Creating..." : "Create Semester"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table view */}
      <div className="bg-[#181826] rounded-xl p-6">
        <table className="w-full border-separate border-spacing-y-1">
          <thead>
            <tr>
              {['Name', 'Duration', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9] px-3 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {semesters?.map((sem) => (
              <tr key={sem._id} className="bg-[#12121e] hover:bg-[#1e1e2d] transition-colors group">
                <td className="px-3 py-3 rounded-l-lg">
                  <span className="font-semibold text-[#b6a0ff] text-sm">{sem.name}</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5 text-[#aba9b9] text-[13px]">
                    <CalendarDays size={14} className="text-[#aba9b9]" />
                    {new Date(sem.startDate).toLocaleDateString()} <span className="text-[#e9e6f7] opacity-50 mx-1">→</span> {new Date(sem.endDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-3 py-3">
                  {sem.status === 'active' && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgba(104,250,221,0.1)] text-[#68fadd] border border-[rgba(104,250,221,0.2)] uppercase tracking-wider">Active</span>
                  )}
                  {sem.status === 'upcoming' && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgba(182,160,255,0.1)] text-[#b6a0ff] border border-[rgba(182,160,255,0.2)] uppercase tracking-wider">Upcoming</span>
                  )}
                  {sem.status === 'completed' && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgba(71,71,84,0.3)] text-[#aba9b9] border border-[rgba(71,71,84,0.4)] uppercase tracking-wider">Completed</span>
                  )}
                </td>
                <td className="px-3 py-3 rounded-r-lg">
                  <div className="flex items-center gap-2">
                    {sem.status === "upcoming" && (
                      <button
                        onClick={() => updateStatus({ id: sem._id, status: "active" })}
                        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[rgba(104,250,221,0.08)] text-[#68fadd] hover:bg-[rgba(104,250,221,0.15)] transition-colors uppercase tracking-wider"
                      >
                        <PlayCircle size={14} />
                        Activate
                      </button>
                    )}
                    {sem.status === "active" && (
                      <button
                        onClick={() => updateStatus({ id: sem._id, status: "completed" })}
                        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[rgba(71,71,84,0.3)] text-[#aba9b9] hover:text-[#e9e6f7] transition-colors uppercase tracking-wider"
                      >
                        <CheckCircle2 size={14} />
                        Mark Complete
                      </button>
                    )}
                    {sem.status === "completed" && (
                      <span className="text-[11px] text-[#aba9b9] italic px-2">No actions available</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {(!semesters || semesters.length === 0) && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-[#aba9b9] text-sm">
                  <div className="flex flex-col items-center gap-3">
                    <CalendarDays size={32} className="text-[rgba(71,71,84,0.6)]" />
                    <p>No semesters found. Create one to get started.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}