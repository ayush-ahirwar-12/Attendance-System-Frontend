"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { logout as logoutSlice } from "@/redux/slices/authSlice"
import { useLogoutApi } from "../hooks/useAuthApi";
import {
LogOut,
} from 'lucide-react';



const Logout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { mutate: logoutUser, isPending } = useLogoutApi();

  const handleLogout = () => {
    logoutUser(undefined, {
      onSuccess: () => {
        Cookies.remove("token", { path: '/' });
        Cookies.remove("refreshToken", { path: '/' });
        Cookies.remove("role", { path: '/' });
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {}
        dispatch(logoutSlice());
        router.replace("/login");
        setTimeout(() => {
          try {
            // try to close window in environments that allow it (electron, opened windows)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.open('', '_self');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.close();
          } catch {}
          window.location.href = '/login';
        }, 50);
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        Cookies.remove("token", { path: '/' });
        Cookies.remove("refreshToken", { path: '/' });
        Cookies.remove("role", { path: '/' });
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {}
        dispatch(logoutSlice());
        router.replace("/login");
        setTimeout(() => {
          try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.open('', '_self');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.close();
          } catch {}
          window.location.href = '/login';
        }, 50);
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-3 px-[14px] py-[11px] rounded-[10px] text-sm font-medium text-[#ff716c] hover:bg-[rgba(255,113,108,0.08)] transition-all w-full text-left"
    >
      <LogOut size={18}/>{isPending ? "Logging out..." : "Logout"}
    </button>
  );
};

export default Logout;
