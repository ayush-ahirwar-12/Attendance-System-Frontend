"use client"

import React from 'react';
import { Camera, CheckCircle, Clock, LayoutDashboard, Bell, User } from 'lucide-react';

const StudentDashboard = () => {
  // Example data - in a real app, this comes from your MongoDB/API
  const attendanceData = [
    { subject: 'Data Structures', time: '09:15 AM', status: 'Present', date: 'Oct 24, 2025' },
    { subject: 'Database Systems', time: '11:00 AM', status: 'Present', date: 'Oct 24, 2025' },
    { subject: 'Algorithms', time: '02:30 PM', status: 'Late', date: 'Oct 23, 2025' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sidebar / Nav */}
      <nav className="fixed left-0 top-0 h-full w-20 bg-white border-r border-slate-200 flex flex-col items-center py-8 gap-10 z-50">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Camera size={24} />
        </div>
        <div className="flex flex-col gap-8 text-slate-400">
          <LayoutDashboard className="text-indigo-600 cursor-pointer" />
          <Bell className="hover:text-slate-600 cursor-pointer" />
          <User className="hover:text-slate-600 cursor-pointer" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-28 pr-8 py-10 max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-800">Student Portal</h1>
            <p className="text-slate-500 font-medium">Identity Verified: Puneet Yadav</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-slate-700">System Live</span>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* FACE SCANNER VISUAL (Left Column) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group border-4 border-white shadow-2xl">
              {/* Scanning Animation Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent h-1/2 w-full animate-[scan_3s_ease-in-out_infinite] z-0"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-48 h-48 rounded-full border-2 border-dashed border-indigo-400 p-2 mb-6 group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                    {/* Placeholder for User Image */}
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Puneet" 
                      alt="Face Scan" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1">Face Recognition</h2>
                <p className="text-indigo-300 text-sm font-medium">98.4% Match Accuracy</p>
                <button className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-900">
                  Re-verify Identity
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                <Clock size={32} />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Late Marks</p>
                <p className="text-3xl font-black">02</p>
              </div>
            </div>
          </div>

          {/* ATTENDANCE DATA (Right Column) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Overall Percentage Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-bold">Attendance Score</h3>
                 <span className="text-5xl font-black text-indigo-600">92%</span>
               </div>
               <div className="w-full bg-slate-100 h-6 rounded-full p-1">
                 <div className="bg-gradient-to-r from-indigo-500 to-blue-400 h-full rounded-full w-[92%] shadow-md"></div>
               </div>
               <p className="mt-4 text-slate-500 font-medium italic">"You're in the top 5% of the class. Keep it up!"</p>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-bold">Recent Logs</h3>
                <button className="text-indigo-600 font-bold text-sm">Download Report</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-black tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Subject</th>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-8 py-4">Time</th>
                      <th className="px-8 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {attendanceData.map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition">
                        <td className="px-8 py-5 font-bold text-slate-700">{log.subject}</td>
                        <td className="px-8 py-5 text-slate-500">{log.date}</td>
                        <td className="px-8 py-5 text-slate-500">{log.time}</td>
                        <td className="px-8 py-5">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                            log.status === 'Present' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Custom Styles for Scanner */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;