'use client';

import React from 'react';
import ManagerDashboard from '@/components/manager/DashboardOverview';
import { useRouter } from 'next/navigation';

export default function ManagerPageClient() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    router.push(`/manager/${page}`);
  };

  return <ManagerDashboard onNavigate={handleNavigate as any} />;
}
