import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageUrl: string;
}

const AuthLayout = ({ children, imageUrl }: AuthLayoutProps) => {
  return (
    <div className="h-screen w-full bg-[#DCDCDC] flex gap-3.5 p-5 font-[satoshi]">
      <div className="bg-white w-full rounded-base">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
