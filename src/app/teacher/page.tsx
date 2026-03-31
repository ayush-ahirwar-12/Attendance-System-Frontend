import AttendanceFeed from '@/features/teacher/components/AttendanceFeed';
import RightPanel from '@/features/teacher/components/RightPanel';
import Sidebar from '@/features/teacher/components/SideBar';
import StatsGrid from '@/features/teacher/components/StatsGrid';
import TopBar from '@/features/teacher/components/TopBar';

const page = () => {
  return (
    <div>Teacher page</div>
  )
}



export default function DashboardPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f9fa", color: "#191c1d" }}>
      <Sidebar />
      <main className="ml-72 min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 px-10 py-8 space-y-8">
          <StatsGrid />
          <div className="grid grid-cols-12 gap-8">
            <AttendanceFeed />
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}