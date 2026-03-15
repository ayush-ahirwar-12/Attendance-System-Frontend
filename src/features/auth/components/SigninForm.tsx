"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLogin } from '../hooks/useAuthApi';
import Cookies from "js-cookie";
import { setUser } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import LabelInput from './LabelInput';

const SigninForm = () => {
  const [errormsg, seterrormsg] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const safeRedirect = redirect && redirect.startsWith("/") ? redirect : null;

  const { register, handleSubmit, formState: { errors } } = useForm<{
    email: string;
    password: string;
  }>();

  const { mutate: loginUser, isPending: isLoggingIn } = useLogin();

  const onSubmit = (formData: { email: string; password: string }) => {
    seterrormsg("");
    const sendData = new FormData();
    sendData.append("email", formData.email);
    sendData.append("password", formData.password);

    loginUser(sendData, {
      onSuccess: (res: any) => {
        Cookies.set("access", res.data.token);
        Cookies.set("role", res.data.user?.role?.name || "user");

        dispatch(setUser({
          id: res.data.user._id,
          email: res.data.user.email,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          role: res.data.user?.role?.name || "user",
          isVerified: res.data.user.isVerified,
        }));

        router.push(res.data.user?.role?.name === "admin" ? (safeRedirect || "/admin") : (safeRedirect || "/"));
      },
      onError: (err: any) => {
        seterrormsg(err?.response?.data?.message || "Invalid credentials. Please try again.");
      },
    });
  };

  return (
    // Background ko thoda off-white (gray-50) rakha hai taaki white card chamke
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-12">
      
      <div className="w-full max-w-[480px] z-10">
        {/* Is div mein main border aur shadow hai */}
        <div className="bg-white rounded-[2.5rem] border-2 border-gray-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-8 md:p-12 transition-all hover:border-gray-300/80">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100 mb-6">
              <Sparkles size={26} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sign In</h1>
            <p className="text-gray-500 mt-2 font-medium">Enter your details to access your account</p>
          </div>

          {/* Error Message */}
          {errormsg && (
            <div className="flex items-center gap-3 bg-red-50 text-red-600 px-4 py-3 rounded-2xl border border-red-200 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={18} />
              <p className="text-sm font-semibold">{errormsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <LabelInput
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email ? "Email is required" : ""}
              {...register("email", { required: true })}
            />

            <div className="space-y-1">
              <LabelInput
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password ? "Password is required" : ""}
                {...register("password", { required: true })}
              />
              <div className="flex justify-end pt-1">
                <a href="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all">
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="group w-full h-[58px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-100 disabled:bg-blue-400 disabled:shadow-none mt-4"
            >
              {isLoggingIn ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-medium">
              New here?{" "}
              <a href="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;