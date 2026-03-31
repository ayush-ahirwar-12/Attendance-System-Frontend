import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react'
import type { Metadata } from "next";
// import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

export default teacherLayout;