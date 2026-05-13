"use client";
import { useMarkAttendance } from "@/features/attendance/hooks/useAttendanceApi";
import { useGetMyCourses } from "@/features/course/hooks/useCourseApi";
import { useState } from "react";
import { QrCode, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";

export default function StudentAttendancePage() {
  const [qrToken, setQrToken] = useState("");
  const { data: fetchedCourses, isLoading } = useGetMyCourses();
  
  const courses = Array.isArray(fetchedCourses) 
    ? fetchedCourses 
    : (fetchedCourses as any)?.data || (fetchedCourses as any)?.courses || [];
  const { mutate: markAttendance, isPending } = useMarkAttendance();

  const handleMark = () => {
    // Location get karo
    navigator.geolocation.getCurrentPosition(async (position) => {
      // Face image — aapka existing face capture logic yahan aayega
      const faceImage = "base64_face_image_here";

      markAttendance({
        qrToken,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        faceImage
      });
    }, () => {
      alert("Location access required!");
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight">Mark Attendance</h1>
        <p className="text-sm text-[#aba9b9] mt-2">Scan the QR token and verify your identity to mark attendance.</p>
      </div>

      {/* Mark Attendance Card */}
      <div className="bg-[#181826] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[rgba(182,160,255,0.08)] mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[rgba(182,160,255,0.1)] flex items-center justify-center text-[#b6a0ff]">
            <QrCode size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#e9e6f7]">QR Verification</h2>
            <p className="text-xs text-[#aba9b9] mt-0.5">Enter the token provided by your instructor</p>
          </div>
        </div>
        
        <input
          value={qrToken}
          onChange={(e) => setQrToken(e.target.value)}
          placeholder="e.g. 8f92a4..."
          className="w-full bg-[#12121e] border border-[rgba(71,71,84,0.3)] rounded-xl px-4 py-3.5 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:border-[rgba(182,160,255,0.4)] focus:bg-[#0d0d18] transition-all mb-5 tracking-wide"
        />
        
        <button
          onClick={handleMark}
          disabled={isPending || !qrToken}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {isPending ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          ) : (
            <ShieldCheck size={18} />
          )}
          {isPending ? "Verifying Identity..." : "Verify & Mark Attendance"}
        </button>
      </div>

      {/* Attendance % per course */}
      <div>
        <h3 className="text-sm font-bold tracking-wider uppercase text-[#aba9b9] mb-4 pl-1">Your Courses</h3>
        <div className="space-y-3">
          {isLoading ? (
            // Skeleton Loading UI
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#181826] border border-[rgba(71,71,84,0.3)] rounded-xl p-5 animate-pulse">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-5 bg-[rgba(182,160,255,0.1)] rounded-md w-1/3"></div>
                  <div className="h-6 bg-[rgba(104,250,221,0.05)] rounded-md w-14"></div>
                </div>
                <div className="w-full bg-[rgba(71,71,84,0.3)] rounded-full h-1.5 mt-2"></div>
              </div>
            ))
          ) : courses && courses.length > 0 ? (
            courses.map((enrollment: any) => {
              const isDefaulter = enrollment.percentage < 75;
              
              return (
                <div key={enrollment._id} className="bg-[#181826] border border-[rgba(71,71,84,0.3)] rounded-xl p-5 hover:border-[rgba(182,160,255,0.2)] transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold text-[#e9e6f7]">{enrollment.course?.name}</p>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                      isDefaulter 
                        ? "bg-[rgba(255,107,107,0.1)] text-[#ff6b6b] border border-[rgba(255,107,107,0.2)]" 
                        : "bg-[rgba(104,250,221,0.1)] text-[#68fadd] border border-[rgba(104,250,221,0.2)]"
                    }`}>
                      {isDefaulter ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                      {enrollment.percentage}%
                    </div>
                  </div>
                  
                  <div className={`w-full rounded-full h-1.5 ${
                    isDefaulter ? "bg-[rgba(255,107,107,0.1)]" : "bg-[rgba(104,250,221,0.1)]"
                  }`}>
                    <div
                      className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                        isDefaulter ? "bg-[#ff6b6b] shadow-[0_0_10px_rgba(255,107,107,0.5)]" : "bg-[#68fadd] shadow-[0_0_10px_rgba(104,250,221,0.5)]"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, enrollment.percentage))}%` }}
                    />
                  </div>
                  
                  {isDefaulter && (
                    <p className="text-[11px] text-[#ff6b6b] mt-3 flex items-center gap-1.5 opacity-80">
                      <AlertTriangle size={12} /> You are below the 75% attendance threshold.
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 bg-[#12121e] border border-[rgba(71,71,84,0.3)] rounded-xl">
              <p className="text-sm text-[#aba9b9]">No enrolled courses found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}