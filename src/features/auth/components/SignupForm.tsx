"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRegisterApi } from '../hooks/useAuthApi';
import Cookies from "js-cookie";
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUser } from '@/redux/slices/authSlice';
import { AlertCircle, ArrowRight, Loader2, Sparkles, UserPlus } from 'lucide-react';
import LabelInput from './LabelInput';

const SignupForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
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

        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("password", data.password);

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
                const message = err?.response?.data?.message || err?.message || "Registration failed.";
                setServerError(message);
            },
        });
    }

    return (
        /* Background color change kiya hai taaki white card alag dikhe */
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-1">
            
            <div className="w-full max-w-[550px] z-10">
                {/* Main Card with visible border and soft shadow */}
                <div className="bg-white rounded-[2.5rem] border-2 border-gray-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-8 md:p-12 transition-all hover:border-gray-300/80">
                    
                    {/* Header */}
                    <div className="text-center mb-10">
                        {/* <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100 mb-6">
                            <UserPlus size={26} />
                        </div> */}
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
                        <p className="text-gray-500 mt-2 font-medium">Join us today! It only takes a minute.</p>
                    </div>

                    {/* Error / Success Messages */}
                    {(isError || serverError) && (
                        <div className="flex items-center gap-3 bg-red-50 text-red-600 px-4 py-3 rounded-2xl border border-red-200 mb-8 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} />
                            <p className="text-sm font-semibold text-wrap">{serverError || "Something went wrong"}</p>
                        </div>
                    )}

                    {isSuccess && (
                        <div className="flex items-center gap-3 bg-green-50 text-green-600 px-4 py-3 rounded-2xl border border-green-200 mb-8 animate-in fade-in zoom-in">
                            <Sparkles size={18} />
                            <p className="text-sm font-semibold">Account created! Redirecting...</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        {/* Name Row (Grid layout used for desktop) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className="group w-full h-[58px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-100 disabled:bg-blue-400 disabled:shadow-none mt-4"
                        >
                            {isRegistering ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer with separator line */}
                    <div className="mt-1 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-500 font-medium">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupForm;