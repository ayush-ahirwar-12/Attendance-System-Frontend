'use client';

import React, { useState } from 'react';
import { Search, Download, CheckSquare, Check, X, Clock } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  rollNo: string;
  initials: string;
  faceScan: boolean | null;
  qrScan: boolean | null;
  arrivalTime: string | null;
  attendance: number;
  status: 'Present' | 'Absent' | 'Late';
}

const allStudents: Student[] = [
  { id: 1,  name: 'Aarav Sharma',  rollNo: 'CS21001', initials: 'AS', faceScan: true,  qrScan: true,  arrivalTime: '1:58 PM', attendance: 96,  status: 'Present' },
  { id: 2,  name: 'Priya Singh',   rollNo: 'CS21002', initials: 'PS', faceScan: true,  qrScan: false, arrivalTime: '2:05 PM', attendance: 88,  status: 'Late'    },
  { id: 3,  name: 'Rahul Verma',   rollNo: 'CS21003', initials: 'RV', faceScan: false, qrScan: false, arrivalTime: null,      attendance: 72,  status: 'Absent'  },
  { id: 4,  name: 'Ananya Patel',  rollNo: 'CS21004', initials: 'AP', faceScan: true,  qrScan: true,  arrivalTime: '2:01 PM', attendance: 100, status: 'Present' },
  { id: 5,  name: 'Vikram Kumar',  rollNo: 'CS21005', initials: 'VK', faceScan: true,  qrScan: true,  arrivalTime: '1:55 PM', attendance: 91,  status: 'Present' },
  { id: 6,  name: 'Sneha Reddy',   rollNo: 'CS21006', initials: 'SR', faceScan: false, qrScan: false, arrivalTime: null,      attendance: 65,  status: 'Absent'  },
  { id: 7,  name: 'Arjun Nair',    rollNo: 'CS21007', initials: 'AN', faceScan: true,  qrScan: false, arrivalTime: '2:12 PM', attendance: 83,  status: 'Late'    },
  { id: 8,  name: 'Meera Iyer',    rollNo: 'CS21008', initials: 'MI', faceScan: true,  qrScan: true,  arrivalTime: '2:00 PM', attendance: 95,  status: 'Present' },
  { id: 9,  name: 'Rohan Gupta',   rollNo: 'CS21009', initials: 'RG', faceScan: true,  qrScan: true,  arrivalTime: '1:59 PM', attendance: 89,  status: 'Present' },
  { id: 10, name: 'Kavya Menon',   rollNo: 'CS21010', initials: 'KM', faceScan: false, qrScan: false, arrivalTime: null,      attendance: 58,  status: 'Absent'  },
];

type FilterType = 'All' | 'Present' | 'Absent' | 'Late';

const ScanIcon = ({ val }: { val: boolean | null }) => {
  if (val === true)  return <Check size={14} className="text-[#68fadd]" />;
  if (val === false) return <X    size={14} className="text-[#ff716c]" />;
  return <span className="text-[#aba9b9]">—</span>;
};

const StatusBadge = ({ status }: { status: Student['status'] }) => {
  if (status === 'Present')
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(104,250,221,0.12)] text-[#68fadd]"><Check size={10} /> Present</span>;
  if (status === 'Late')
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(255,152,0,0.12)] text-[#ff9800]"><Clock size={10} /> Late</span>;
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(255,113,108,0.12)] text-[#ff716c]"><X size={10} /> Absent</span>;
};

export default function StudentsPage() {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<FilterType>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState<Student[]>(allStudents);

  const counts: Record<FilterType, number> = {
    All:     allStudents.length,
    Present: allStudents.filter(s => s.status === 'Present').length,
    Absent:  allStudents.filter(s => s.status === 'Absent').length,
    Late:    allStudents.filter(s => s.status === 'Late').length,
  };

  const statColors: Record<FilterType, string> = {
    All:     'text-[#e9e6f7]',
    Present: 'text-[#68fadd]',
    Absent:  'text-[#ff716c]',
    Late:    'text-[#ff9800]',
  };

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase());
    return (filter === 'All' || s.status === filter) && matchSearch;
  });

  const cycleStatus = (id: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== id) return s;
      const cycle: Student['status'][] = ['Present', 'Late', 'Absent'];
      return { ...s, status: cycle[(cycle.indexOf(s.status) + 1) % 3] };
    }));
  };

  const pctColor = (p: number) => p >= 85 ? '#68fadd' : p >= 70 ? '#ff9800' : '#ff716c';
  const pctGrad  = (p: number) =>
    p >= 85 ? 'linear-gradient(90deg,#56ebcf,#68fadd)'
    : p >= 70 ? 'linear-gradient(90deg,#ff9800,#ffb74d)'
    : 'linear-gradient(90deg,#ff716c,#ff928c)';

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight">Students</h1>
          <p className="text-sm text-[#aba9b9] mt-1">
            CS401 · Machine Learning &nbsp;•&nbsp; Room 301 &nbsp;•&nbsp; Today, {dateStr}
          </p>
        </div>
        <div className="flex gap-2.5">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#e9e6f7] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] transition-colors">
            <Download size={14} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#003830] bg-gradient-to-r from-[#68fadd] to-[#56ebcf] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(104,250,221,0.25)] transition-all">
            <CheckSquare size={14} /> Mark All Present
          </button>
        </div>
      </div>

      {/* Stats chips */}
      <div className="flex gap-3 mb-5">
        {(Object.entries(counts) as [FilterType, number][]).map(([key, val]) => (
          <div key={key} className="bg-[#181826] rounded-lg px-5 py-2.5 flex items-center gap-2.5">
            <span className={`text-xl font-bold ${statColors[key]}`}>{val}</span>
            <span className="text-xs text-[#aba9b9]">{key}</span>
          </div>
        ))}
      </div>

      {/* Search + filter tabs */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9b9] pointer-events-none" />
          <input
            className="w-full bg-[#12121e] border border-transparent rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:bg-[#1e1e2d] focus:border-[rgba(182,160,255,0.25)] transition-all"
            placeholder="Search by name or roll no..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex bg-[#12121e] rounded-[10px] p-1 gap-1">
          {(['All', 'Present', 'Absent', 'Late'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                filter === f ? 'bg-[#242434] text-[#e9e6f7]' : 'text-[#aba9b9] hover:text-[#e9e6f7]'
              }`}
            >
              {f} <span className="opacity-60 text-[11px]">({counts[f]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#181826] rounded-xl p-6">
        <table className="w-full border-separate border-spacing-y-1">
          <thead>
            <tr>
              {['#','Student','Roll No','Face Scan','QR Scan','Arrival','Attendance %','Status','Actions'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9] px-3 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} className="bg-[#12121e] hover:bg-[#1e1e2d] transition-colors cursor-pointer">
                <td className="px-3 py-3 text-xs text-[#aba9b9] rounded-l-lg">{i + 1}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7e51ff] to-[#56ebcf] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                      {s.initials}
                    </div>
                    <span className="text-sm font-medium text-[#e9e6f7]">{s.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="font-mono text-xs text-[#aba9b9] bg-[#242434] px-2 py-1 rounded">
                    {s.rollNo}
                  </span>
                </td>
                <td className="px-3 py-3"><ScanIcon val={s.faceScan} /></td>
                <td className="px-3 py-3"><ScanIcon val={s.qrScan}  /></td>
                <td className="px-3 py-3 text-[13px] text-[#aba9b9]">{s.arrivalTime ?? '—'}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#242434] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.attendance}%`, background: pctGrad(s.attendance) }} />
                    </div>
                    <span className="text-xs font-semibold min-w-[32px] text-right" style={{ color: pctColor(s.attendance) }}>
                      {s.attendance}%
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-3 py-3 rounded-r-lg">
                  <button
                    onClick={() => cycleStatus(s.id)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#1e1e2d] text-[#aba9b9] hover:text-[#e9e6f7] transition-colors"
                  >
                    Override
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-[#aba9b9] text-sm">
                  No students match your search / filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-5">
          <div className="text-xs text-[#aba9b9]">
            Showing {Math.min(filtered.length, 10 * currentPage)} of {filtered.length} students
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-md text-sm flex items-center justify-center transition-all font-medium ${
                  currentPage === p
                    ? 'bg-[#b6a0ff] text-white'
                    : 'bg-[#12121e] text-[#aba9b9] hover:bg-[#1e1e2d] hover:text-[#e9e6f7]'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(4, p + 1))}
              className="w-8 h-8 rounded-md text-sm flex items-center justify-center bg-[#12121e] text-[#aba9b9] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] font-medium"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
