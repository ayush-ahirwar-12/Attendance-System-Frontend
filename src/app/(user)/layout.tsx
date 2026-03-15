import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation";
import React from "react";


export const dynamic = 'force-dynamic';


const userLayout=async({children}:{children:React.ReactNode})=>{
    const user = await getCurrentUser();
    
    if(!user){

        redirect("/login");
    }else{
        if(!user?.isVerified){

            redirect("/un-verified")
        }
    }
    return (
        <div>
            {children}
        </div>
    )
}

export default userLayout;