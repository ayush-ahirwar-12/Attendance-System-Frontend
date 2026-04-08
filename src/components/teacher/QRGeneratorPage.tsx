'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, RefreshCw, Maximize2, Clock, Eye } from 'lucide-react';

interface QRSession { id: number; classCode: string; className: string; date: string; generatedAt: string; expiry: string; scanned: number; total: number; status: 'Expired' | 'Active' | 'Completed'; }

const pastSessions: QRSession[] = [
  { id: 1, classCode: 'CS301', className: 'Algorithm Design',  date: 'Apr 4, 2026', generatedAt: '9:02 AM',  expiry: '5 min',  scanned: 38, total: 40, status: 'Completed' },
  { id: 2, classCode: 'CS205', className: 'Data Structures',   date: 'Apr 4, 2026', generatedAt: '11:03 AM', expiry: '10 min', scanned: 32, total: 38, status: 'Completed' },
  { id: 3, classCode: 'CS102', className: 'Python Programming', date: 'Apr 3, 2026', generatedAt: '4:00 PM',  expiry: '10 min', scanned: 29, total: 35, status: 'Expired'   },
];

const CLASSES = [
  { code: 'CS401', name: 'Machine Learning',   room: 'Room 301', start: '2:00 PM', end: '4:00 PM',  total: 40 },
  { code: 'CS102', name: 'Python Programming', room: 'Room 202', start: '4:00 PM', end: '6:00 PM',  total: 35 },
  { code: 'CS301', name: 'Algorithm Design',   room: 'Room 201', start: '9:00 AM', end: '11:00 AM', total: 40 },
];

const EXPIRY_OPTIONS = [5, 10, 15, 30];
const MODES = ['Face + QR', 'QR Only', 'Face Only'];

export default function QRGeneratorPage() {
  const [selectedClass, setSelectedClass] = useState(0);
  const [expiry,  setExpiry]  = useState(10);
  const [mode,    setMode]    = useState(0);
  const [generated, setGenerated] = useState(false);
  const [timeLeft,  setTimeLeft]  = useState(0);
  const [scanCount, setScanCount] = useState(0);
  const [qrValue,   setQrValue]   = useState('');
  const [Courses,setCourses]= useState();
  

  

  const cls = CLASSES[selectedClass];

  const generateQR = () => {
    setQrValue(JSON.stringify({ class: cls.code, session: new Date().toISOString(), room: cls.room, expires: expiry }));
    setGenerated(true);
    setTimeLeft(expiry * 60);
    setScanCount(0);
  };

  useEffect(() => {
    if (!generated || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(id); return 0; } return t - 1; });
      if (Math.random() < 0.05) setScanCount(c => Math.min(c + 1, cls.total));
    }, 1000);
    return () => clearInterval(id);
  }, [generated, timeLeft, cls.total]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const isExpired = generated && timeLeft === 0;

  const handleDownload = () => {
    const svg = document.getElementById('attend-qr-svg');
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `${cls.code}-qr.svg` });
    a.click();
  };

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight">QR Generator</h1>
          <p className="text-sm text-[#aba9b9] mt-1">Generate session QR codes for attendance</p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[#aba9b9] bg-[#181826] px-4 py-2 rounded-full">
          <span>📅</span> {dateStr}
        </div>
      </div>

      {/* Two-column */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        {/* LEFT: Config */}
        <div className="bg-[rgba(36,36,52,0.6)] backdrop-blur-2xl rounded-xl p-6 border border-[rgba(182,160,255,0.06)]">
          <h2 className="text-[15px] font-semibold text-[#e9e6f7] mb-5">Session Configuration</h2>

          <div className="flex flex-col gap-4">
            {/* Class selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9]">Select Class</label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={e => { setSelectedClass(+e.target.value); setGenerated(false); setTimeLeft(0); }}
                  className="w-full bg-[#12121e] border border-transparent rounded-lg py-2.5 pl-3 pr-9 text-sm text-[#e9e6f7] appearance-none focus:outline-none focus:bg-[#1e1e2d] focus:border-[rgba(182,160,255,0.3)] transition-all cursor-pointer"
                >
                  {CLASSES.map((c, i) => <option key={c.code} value={i}>{c.code} — {c.name}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aba9b9] pointer-events-none text-sm">▾</span>
              </div>
            </div>

            {/* Date + Room */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9]">Date</label>
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="bg-[#12121e] border border-transparent rounded-lg py-2.5 px-3 text-sm text-[#e9e6f7] focus:outline-none focus:bg-[#1e1e2d] focus:border-[rgba(182,160,255,0.3)] transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9]">Room</label>
                <input type="text" defaultValue={cls.room} key={`room-${selectedClass}`} className="bg-[#12121e] border border-transparent rounded-lg py-2.5 px-3 text-sm text-[#e9e6f7] focus:outline-none focus:bg-[#1e1e2d] focus:border-[rgba(182,160,255,0.3)] transition-all" />
              </div>
            </div>

            {/* Start + End time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9]">Start Time</label>
                <input type="text" defaultValue={cls.start} key={`start-${selectedClass}`} className="bg-[#12121e] border border-transparent rounded-lg py-2.5 px-3 text-sm text-[#e9e6f7] focus:outline-none focus:bg-[#1e1e2d] focus:border-[rgba(182,160,255,0.3)] transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9]">End Time</label>
                <input type="text" defaultValue={cls.end} key={`end-${selectedClass}`} className="bg-[#12121e] border border-transparent rounded-lg py-2.5 px-3 text-sm text-[#e9e6f7] focus:outline-none focus:bg-[#1e1e2d] focus:border-[rgba(182,160,255,0.3)] transition-all" />
              </div>
            </div>

            {/* QR Expiry */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9]">QR Expiry</label>
              <div className="flex flex-wrap gap-2">
                {EXPIRY_OPTIONS.map(opt => (
                  <label
                    key={opt}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm cursor-pointer border transition-all ${
                      expiry === opt
                        ? 'border-[#b6a0ff] bg-[rgba(182,160,255,0.08)] text-[#b6a0ff]'
                        : 'border-[rgba(71,71,84,0.4)] text-[#aba9b9] hover:border-[#b6a0ff] hover:text-[#b6a0ff]'
                    }`}
                  >
                    <input type="radio" className="hidden" checked={expiry === opt} onChange={() => setExpiry(opt)} />
                    {opt} min
                  </label>
                ))}
              </div>
            </div>

            {/* Attendance Mode */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9]">Attendance Mode</label>
              <div className="flex bg-[#12121e] rounded-lg p-1 gap-1">
                {MODES.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setMode(i)}
                    className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all ${
                      mode === i
                        ? 'bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] text-white'
                        : 'text-[#aba9b9] hover:text-[#e9e6f7]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 mt-1">
              <button
                onClick={generateQR}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all"
              >
                <span className="text-base">⊞</span> Generate QR Code
              </button>
              <button className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-[#e9e6f7] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] transition-colors whitespace-nowrap">
                <Clock size={14} /> Schedule
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: QR Display */}
        <div className="bg-[#181826] rounded-xl p-8 flex flex-col items-center gap-5">
          {!generated ? (
            <div className="text-center text-[#aba9b9] py-16">
              <div className="text-7xl mb-4 opacity-30">⊞</div>
              <div className="text-base font-medium">Configure session &amp; click Generate</div>
              <div className="text-xs mt-2">QR code will appear here</div>
            </div>
          ) : (
            <>
              {/* QR */}
              <div className="bg-[#242434] rounded-2xl p-6 shadow-[0_0_60px_rgba(182,160,255,0.15),0_0_20px_rgba(182,160,255,0.08)]">
                {isExpired ? (
                  <div className="w-[200px] h-[200px] flex flex-col items-center justify-center gap-2">
                    <span className="text-5xl">⏱️</span>
                    <span className="text-[#ff716c] font-semibold text-sm">QR Expired</span>
                  </div>
                ) : (
                  <QRCodeSVG id="attend-qr-svg" value={qrValue} size={200} bgColor="#242434" fgColor="#e9e6f7" level="H" style={{ borderRadius: 8 }} />
                )}
              </div>

              {/* Class name + timer */}
              <div className="text-center">
                <div className="text-lg font-bold text-[#e9e6f7]">{cls.code} — {cls.name}</div>
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  <Clock size={13} className="text-[#aba9b9]" />
                  <span className="text-xs text-[#aba9b9]">Expires in</span>
                  <span className="text-2xl font-bold text-[#68fadd] leading-none tabular-nums" aria-live="polite">
                    {fmt(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[`🏛 ${cls.room}`, `📅 ${dateStr}`, `⏰ ${cls.start} – ${cls.end}`].map(chip => (
                  <span key={chip} className="text-xs text-[#aba9b9] bg-[#12121e] px-3 py-1.5 rounded-full">{chip}</span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button onClick={handleDownload} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[rgba(104,250,221,0.12)] text-[#68fadd] hover:scale-105 transition-transform" title="Download"><Download size={15} /></button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[rgba(182,160,255,0.12)] text-[#b6a0ff] hover:scale-105 transition-transform" title="Share"><Share2 size={15} /></button>
                <button onClick={generateQR} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#e9e6f7] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] transition-colors">
                  <RefreshCw size={12} /> Regenerate
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#aba9b9] hover:text-[#e9e6f7] transition-colors">
                  <Maximize2 size={12} /> Fullscreen
                </button>
              </div>

              {/* Scan stats */}
              <div className="text-sm text-[#aba9b9] text-center">
                Scanned: <strong className="text-[#68fadd]">{scanCount} students</strong> &nbsp;·&nbsp;
                Expected: <strong className="text-[#aba9b9]">{cls.total}</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent QR Sessions */}
      <div className="bg-[#181826] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-base font-semibold text-[#e9e6f7]">Recent QR Sessions</div>
            <div className="text-xs text-[#aba9b9] mt-0.5">History of generated QR codes</div>
          </div>
        </div>
        <table className="w-full border-separate border-spacing-y-1">
          <thead>
            <tr>
              {['Class', 'Date', 'Generated At', 'Expiry', 'Students Scanned', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9] px-3.5 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pastSessions.map(s => {
              const pct = Math.round(s.scanned / s.total * 100);
              return (
                <tr key={s.id} className="bg-[#12121e] hover:bg-[#1e1e2d] transition-colors">
                  <td className="px-3.5 py-3 rounded-l-lg">
                    <div className="font-semibold text-[#b6a0ff] text-sm">{s.classCode}</div>
                    <div className="text-[11px] text-[#aba9b9]">{s.className}</div>
                  </td>
                  <td className="px-3.5 py-3 text-[13px] text-[#aba9b9]">{s.date}</td>
                  <td className="px-3.5 py-3 text-[13px] text-[#aba9b9]">{s.generatedAt}</td>
                  <td className="px-3.5 py-3 text-[13px] text-[#e9e6f7]">{s.expiry}</td>
                  <td className="px-3.5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#242434] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#56ebcf] to-[#68fadd]" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-[#68fadd] min-w-[40px] text-right">{s.scanned}/{s.total}</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-3">
                    {s.status === 'Active'    && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(104,250,221,0.12)] text-[#68fadd]">● Active</span>}
                    {s.status === 'Completed' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(182,160,255,0.12)] text-[#b6a0ff]">✓ Completed</span>}
                    {s.status === 'Expired'   && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(171,169,185,0.12)] text-[#aba9b9]">✗ Expired</span>}
                  </td>
                  <td className="px-3.5 py-3 rounded-r-lg">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e1e2d] text-[#aba9b9] hover:text-[#e9e6f7] transition-colors"><Eye size={14} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
