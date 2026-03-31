import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react'

const teacherLayout = async ({children}:{children:React.ReactNode}) => {
const user = await getCurrentUser();
if(!user){
  redirect("/login");
}else{
    if(!user.isVerified){
        redirect("/un-verified");
    }
}
if(user.role !== "teacher"){
    redirect("/unauthorized");
}
  return (
    <div>{children}</div>
  )
}

export default teacherLayout;