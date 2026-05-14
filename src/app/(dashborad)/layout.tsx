export const dynamic = "force-dynamic";
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation';
import React from 'react'
import StudentSidebar from '@/components/student/StudentSidebar';

const CandidateLayout = async({children}:{children:React.ReactNode}) => {

    const user = await getCurrentUser();

    if(!user){
        redirect("/login");
    }
    else{
        if(!user.isVerified){
            redirect("/un-verified");
        }
    }

  return (
    <div className="flex min-h-screen bg-[#0d0d18]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <StudentSidebar user={user} />
      <main className="flex-1 min-h-screen overflow-y-auto p-8 bg-[#0d0d18]">
        {children}
      </main>
    </div>
  )
}

export default CandidateLayout