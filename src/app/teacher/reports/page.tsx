import React from 'react';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-[rgba(182,160,255,0.2)] rounded-2xl bg-[#12121e]">
      <div className="w-16 h-16 rounded-full bg-[rgba(182,160,255,0.08)] flex items-center justify-center mb-4">
        <span className="text-[#b6a0ff] font-semibold text-xl">📊</span>
      </div>
      <h2 className="text-xl font-bold text-[#e9e6f7] mb-2">Reports</h2>
      <p className="text-[#aba9b9] text-sm max-w-md text-center">
        This section is currently under development. Here you will be able to view and download attendance and class reports.
      </p>
    </div>
  );
}
