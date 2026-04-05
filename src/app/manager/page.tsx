'use client';

import React, { useState } from 'react';
import ManagerSidebar    from '@/components/manager/Sidebar';
import ManagerDashboard  from '@/components/manager/DashboardOverview';
import CoursesPage       from '@/components/manager/CoursesPage';
import ClassesPage       from '@/components/manager/ClassesPage';
import ReportsPage       from '@/components/manager/ReportsPage';
import type { ManagerPage } from '@/components/manager/types';

export default function ManagerPageClient() {
  const [activePage, setActivePage] = useState<ManagerPage>('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <ManagerDashboard onNavigate={setActivePage} />;
      case 'courses':   return <CoursesPage />;
      case 'classes':   return <ClassesPage />;
      case 'reports':   return <ReportsPage />;
      default:          return <ManagerDashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0d0d18]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <ManagerSidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 min-h-screen overflow-y-auto p-8 bg-[#0d0d18]">
        {renderPage()}
      </main>
    </div>
  );
}
