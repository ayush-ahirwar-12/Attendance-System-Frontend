'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/teacher/Sidebar';
import DashboardOverview from '@/components/teacher/DashboardOverview';
import StudentsPage from '@/components/teacher/StudentsPage';
import QRGeneratorPage from '@/components/teacher/QRGeneratorPage';

import type { ActivePage } from '@/components/teacher/types';

export default function TeacherPage() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':     return <DashboardOverview onNavigate={setActivePage} />;
      case 'students':      return <StudentsPage />;
      case 'qr-generator':  return <QRGeneratorPage />;
      default:              return <DashboardOverview onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0d0d18]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 min-h-screen overflow-y-auto p-8 bg-[#0d0d18]">
        {renderPage()}
      </main>
    </div>
  );
}