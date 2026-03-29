"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRegisterApi } from '../hooks/useAuthApi';
import Cookies from "js-cookie";
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUser } from '@/redux/slices/authSlice';
import { AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import LabelInput from './LabelInput';
import FaceCapture from './FaceCapture';

const SignupForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);
    const dispatch = useDispatch();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<{
        firstName: string,
        lastName: string,
        email: string,
        phoneNumber: string,
        password: string
    }>();

    const { mutate: registerUser, isPending: isRegistering, isError, error, isSuccess } = useRegisterApi();

    const onSubmit = (data: {
        firstName: string,
        lastName: string,
        email: string,
        phoneNumber: string,
        password: string
    }) => {
        setServerError(null);

        if (!faceDescriptor) {
            setServerError("Please capture your face before registering.");
            return;
        }

        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("password", data.password);
        formData.append("faceDescriptor", JSON.stringify(faceDescriptor));

        registerUser(formData, {
            onSuccess: (res: any) => {
                Cookies.set("access", res.data.token);
                dispatch(
                    setUser({
                        id: res.data.user._id,
                        email: res.data.user.email,
                        firstName: res.data.user.firstName,
                        lastName: res.data.user.lastName,
                        role: res.data.user?.role?.name || "user",
                        isVerified: res.data.user.isVerified
                    })
                );
                router.push("/un-verified");
            },
            onError: (err: any) => {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Registration failed.";
                setServerError(message);
            },
        });
    };

    return (
        /*
         * KEY FIXES:
         * 1. min-h-screen ensures the wrapper always fills the viewport
         * 2. py-10 (instead of py-1) gives breathing room top & bottom so the card is never clipped
         * 3. overflow-y-auto lets the page scroll if the card is taller than the viewport
         * 4. Replaced bg-gray-500 with a clean gradient background
         */
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-10 overflow-y-auto">

            <div className="w-full max-w-[540px] z-10 my-auto">

                {/* Card */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-slate-200/60 p-8 md:p-10">

                    {/* Header */}
                    <div className="text-center mb-8">
                        {/* Icon badge */}
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-200 mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" y1="8" x2="19" y2="14" />
                                <line x1="22" y1="11" x2="16" y2="11" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create your account</h1>
                        <p className="text-gray-400 mt-1 text-sm font-medium">Join us today — it only takes a minute.</p>
                    </div>

                    {/* Error Message */}
                    {(isError || serverError) && (
                        <div className="flex items-start gap-3 bg-red-50 text-red-600 px-4 py-3 rounded-2xl border border-red-200 mb-6">
                            <AlertCircle size={17} className="mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-medium leading-snug">{serverError || "Something went wrong"}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {isSuccess && (
                        <div className="flex items-center gap-3 bg-green-50 text-green-600 px-4 py-3 rounded-2xl border border-green-200 mb-6">
                            <Sparkles size={17} className="flex-shrink-0" />
                            <p className="text-sm font-medium">Account created! Redirecting…</p>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                        {/* First + Last Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <LabelInput
                                label="First Name"
                                placeholder="John"
                                type="text"
                                error={errors.firstName ? "First name required" : ""}
                                {...register("firstName", { required: true })}
                            />
                            <LabelInput
                                label="Last Name"
                                placeholder="Doe"
                                type="text"
                                {...register("lastName")}
                            />
                        </div>

                        <LabelInput
                            label="Email Address"
                            placeholder="name@example.com"
                            type="email"
                            error={errors.email ? "Valid email required" : ""}
                            {...register("email", { required: true })}
                        />

                        <LabelInput
                            label="Phone Number"
                            placeholder="+1 234 567 890"
                            type="text"
                            {...register("phoneNumber")}
                        />

                        <LabelInput
                            label="Password"
                            placeholder="8+ characters"
                            type="password"
                            error={errors.password ? "Password required" : ""}
                            {...register("password", { required: true })}
                        />

                        {/* Face Capture */}
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Face Verification</p>
                            <FaceCapture onCapture={setFaceDescriptor} />
                            {!faceDescriptor ? (
                                <p className="text-red-500 text-xs mt-1.5 font-medium">
                                    Face capture is required to continue
                                </p>
                            ) : (
                                <p className="text-green-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                                    <span>✅</span> Face captured successfully
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isRegistering}
                            className="group w-full h-[52px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md shadow-blue-200 disabled:bg-blue-300 disabled:shadow-none mt-2"
                        >
                            {isRegistering ? (
                                <Loader2 className="animate-spin" size={22} />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                        <p className="text-gray-500 text-sm font-medium">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;