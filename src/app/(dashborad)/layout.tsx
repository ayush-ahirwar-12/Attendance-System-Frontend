import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation';
import React from 'react'

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
    <main>
        {children}
    </main>
  )
}

export default CandidateLayout