'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'; // Optional: npm i lucide-react
import { redirect } from 'next/navigation';

interface VerifyEmailProps {
  email?: string;
  onResend?: () => Promise<void>;
}

export default function VerifyEmail({ 
  email = "your-email@example.com", 
  onResend 
}: VerifyEmailProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleResend = async () => {
    if (!onResend) return;
    
    setIsResending(true);
    try {
      await onResend();
      setResendStatus('success');
      setTimeout(() => setResendStatus('idle'), 5000); // Reset after 5s
    } catch (error) {
      setResendStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100 text-center">
        
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse"></div>
          <div className="relative flex items-center justify-center w-full h-full text-indigo-600">
            <Mail size={48} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Check your email
        </h1>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          We’ve sent a verification link to <br />
          <span className="font-bold text-slate-900">{email}</span>. 
          Please click the link to activate your account.
        </p>

        {/* <div className="space-y-4">
          <button 
            onClick={() => window.open(`https://${email.split('@')[1]}`, '_blank')}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            Open Mailbox
          </button>

          <button 
            disabled={isResending || resendStatus === 'success'}
            onClick={handleResend}
            className="w-full py-4 text-slate-500 font-semibold hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
          >
            {isResending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : resendStatus === 'success' ? (
              <span className="text-green-600">Verification link sent!</span>
            ) : (
              "Didn't receive it? Resend link"
            )}
          </button>
        </div> */}

        <div className="mt-10 pt-8 border-t border-slate-100">
          <button onClick={()=>redirect("/login")} className="text-sm font-medium text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 mx-auto transition-colors">
            <ArrowLeft size={16} />
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}