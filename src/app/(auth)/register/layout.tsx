import React from "react";
import AuthLayout from "../AuthLayout";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout imageUrl="/images/signin.webp">{children}</AuthLayout>;
};

export default layout;
