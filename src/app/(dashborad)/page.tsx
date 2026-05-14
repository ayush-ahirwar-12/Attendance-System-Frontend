"use client";

import { useMarkAttendance } from "@/features/attendance/hooks/useAttendanceApi";
import { useGetMyCourses } from "@/features/course/hooks/useCourseApi";
import { useGetMyAttendance } from "@/features/attendance/hooks/useAttendanceApi";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  QrCode, ShieldCheck, BookOpen, AlertTriangle, CheckCircle2,
  Camera, ScanFace, X, ChevronRight, Loader2, Users,
  CalendarCheck, CalendarX, BarChart3, Zap,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────── */
/* Attendance detail panel (shown when a course is selected)   */
/* ──────────────────────────────────────────────────────────── */
function AttendanceDetail({ courseId, courseName }: { courseId: string; courseName: string }) {
  const { data, isLoading } = useGetMyAttendance(courseId);

  const raw = data as any;
  const total = raw?.totalClasses ?? raw?.total ?? 0;
  const present = raw?.present ?? raw?.attended ?? 0;
  const absent = total - present;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;
  const isAtRisk = pct < 75;

  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const dash = circ * (pct / 100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-[#b6a0ff]" size={28} />
      </div>
    );
  }

  return (
    <div className="mt-4 bg-[#12121e] rounded-2xl p-5 border border-[rgba(182,160,255,0.1)] animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#aba9b9] font-semibold">Attendance Detail</p>
          <h3 className="text-base font-bold text-[#e9e6f7] mt-0.5">{courseName}</h3>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
          isAtRisk
            ? "bg-[rgba(255,107,107,0.15)] text-[#ff6b6b] border border-[rgba(255,107,107,0.25)]"
            : "bg-[rgba(104,250,221,0.12)] text-[#68fadd] border border-[rgba(104,250,221,0.2)]"
        }`}>
          {isAtRisk ? "⚠ At Risk" : "✓ Good Standing"}
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut ring */}
        <div className="relative shrink-0">
          <svg width="132" height="132" viewBox="0 0 132 132">
            <circle cx="66" cy="66" r={radius} fill="none" stroke="rgba(71,71,84,0.35)" strokeWidth="10" />
            <circle
              cx="66" cy="66" r={radius} fill="none"
              stroke={isAtRisk ? "#ff6b6b" : "#68fadd"}
              strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
              strokeDashoffset={circ / 4}
              style={{ filter: `drop-shadow(0 0 8px ${isAtRisk ? "rgba(255,107,107,0.6)" : "rgba(104,250,221,0.6)"})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${isAtRisk ? "text-[#ff6b6b]" : "text-[#68fadd]"}`}>{pct}%</span>
            <span className="text-[10px] text-[#aba9b9]">attended</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-3 gap-3">
          {[
            { label: "Total Classes", val: total, icon: <BarChart3 size={16} />, color: "#b6a0ff" },
            { label: "Present", val: present, icon: <CalendarCheck size={16} />, color: "#68fadd" },
            { label: "Absent", val: absent, icon: <CalendarX size={16} />, color: "#ff6b6b" },
          ].map((s) => (
            <div key={s.label} className="bg-[#181826] rounded-xl p-3 border border-[rgba(71,71,84,0.3)] text-center">
              <div className="flex justify-center mb-1" style={{ color: s.color }}>{s.icon}</div>
              <div className="text-xl font-bold text-[#e9e6f7]">{s.val}</div>
              <div className="text-[10px] text-[#aba9b9] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {isAtRisk && (
        <div className="mt-4 flex items-start gap-2 bg-[rgba(255,107,107,0.08)] border border-[rgba(255,107,107,0.2)] rounded-xl px-4 py-3">
          <AlertTriangle size={14} className="text-[#ff6b6b] shrink-0 mt-0.5" />
          <p className="text-xs text-[#ff6b6b]">
            Your attendance is below the 75% threshold. You need to attend
            <span className="font-bold"> {Math.max(0, Math.ceil(0.75 * total - present))} more</span> classes to meet the requirement.
          </p>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Main page                                                   */
/* ──────────────────────────────────────────────────────────── */
export default function StudentAttendancePage() {
  const [qrToken, setQrToken] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; name: string } | null>(null);

  /* Camera / face */
  const [cameraActive, setCameraActive] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [faceImage, setFaceImage] = useState<string>("");
  const [cameraError, setCameraError] = useState("");
  const [step, setStep] = useState<"idle" | "qr" | "face" | "done">("idle");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /* Hooks */
  const { data: fetchedCourses, isLoading } = useGetMyCourses();
  const courses = Array.isArray(fetchedCourses)
    ? fetchedCourses
    : (fetchedCourses as any)?.data || (fetchedCourses as any)?.courses || [];

  const { mutate: markAttendance, isPending, isSuccess } = useMarkAttendance();

  /* Start camera */
  const startCamera = useCallback(async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError("Camera access denied. Please allow camera permissions.");
    }
  }, []);

  /* Stop camera */
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  /* Capture face */
  const captureFace = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const base64 = canvasRef.current.toDataURL("image/jpeg", 0.8);
    setFaceImage(base64);
    setFaceCaptured(true);
    stopCamera();
    setStep("done");
  };

  /* Submit */
  const handleMark = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        markAttendance({
          qrToken,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          faceImage,
        });
      },
      () => alert("Location access is required to mark attendance.")
    );
  };

  const canSubmit = qrToken.trim().length > 0 && faceCaptured && !isPending;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight leading-tight">
            Mark Attendance
          </h1>
          <p className="text-sm text-[#aba9b9] mt-1">
            Scan your teacher's QR code, then verify your face to check in.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[#aba9b9] bg-[#181826] px-4 py-2 rounded-full border border-[rgba(71,71,84,0.3)]">
          <span>📅</span>
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Success Banner */}
      {isSuccess && (
        <div className="mb-6 flex items-center gap-3 bg-[rgba(104,250,221,0.1)] border border-[rgba(104,250,221,0.25)] rounded-2xl px-5 py-4 animate-fadeIn">
          <CheckCircle2 size={20} className="text-[#68fadd] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#68fadd]">Attendance Marked Successfully!</p>
            <p className="text-xs text-[#aba9b9] mt-0.5">Your presence has been recorded for this session.</p>
          </div>
        </div>
      )}

      {/* Two column layout */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 380px" }}>

        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* STEP 1: QR Code */}
          <div className={`bg-[#181826] rounded-2xl p-6 border transition-all duration-300 ${
            step === "qr" || qrToken
              ? "border-[rgba(182,160,255,0.3)] shadow-[0_0_30px_rgba(182,160,255,0.1)]"
              : "border-[rgba(71,71,84,0.3)]"
          }`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] flex items-center justify-center shadow-[0_4px_16px_rgba(126,81,255,0.35)]">
                <QrCode size={18} color="#fff" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#e9e6f7]">Step 1: QR Code</h2>
                  {qrToken && <CheckCircle2 size={15} className="text-[#68fadd]" />}
                </div>
                <p className="text-xs text-[#aba9b9]">Enter the token shown by your teacher</p>
              </div>
            </div>

            <input
              id="qr-token-input"
              value={qrToken}
              onChange={(e) => { setQrToken(e.target.value); setStep("qr"); }}
              placeholder="Paste or type the QR token (e.g. 8f92a4...)"
              className="w-full bg-[#12121e] border border-[rgba(71,71,84,0.3)] rounded-xl px-4 py-3.5 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:border-[rgba(182,160,255,0.45)] focus:shadow-[0_0_0_3px_rgba(182,160,255,0.08)] transition-all tracking-wide"
            />

            {qrToken && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#68fadd]">
                <CheckCircle2 size={13} /> Token entered — proceed to face verification
              </div>
            )}
          </div>

          {/* STEP 2: Face Verification */}
          <div className={`bg-[#181826] rounded-2xl p-6 border transition-all duration-300 ${
            faceCaptured
              ? "border-[rgba(104,250,221,0.3)] shadow-[0_0_30px_rgba(104,250,221,0.08)]"
              : "border-[rgba(71,71,84,0.3)]"
          }`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                faceCaptured
                  ? "bg-gradient-to-br from-[#68fadd] to-[#00bea3]"
                  : "bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff]"
              }`}>
                <ScanFace size={18} color="#fff" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#e9e6f7]">Step 2: Face Verification</h2>
                  {faceCaptured && <CheckCircle2 size={15} className="text-[#68fadd]" />}
                </div>
                <p className="text-xs text-[#aba9b9]">Allow camera and capture your face</p>
              </div>
            </div>

            {/* Camera preview / captured image */}
            <div className={`relative w-full rounded-xl overflow-hidden mb-4 bg-[#12121e] border ${
              cameraActive
                ? "border-[rgba(182,160,255,0.3)] shadow-[0_0_20px_rgba(182,160,255,0.15)]"
                : "border-[rgba(71,71,84,0.3)]"
            }`} style={{ aspectRatio: "16/9" }}>

              {!cameraActive && !faceCaptured && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-[rgba(182,160,255,0.08)] flex items-center justify-center border-2 border-dashed border-[rgba(182,160,255,0.2)]">
                    <Camera size={28} className="text-[#b6a0ff] opacity-60" />
                  </div>
                  <p className="text-sm text-[#aba9b9]">Camera preview will appear here</p>
                </div>
              )}

              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
                playsInline
                muted
              />

              {faceCaptured && faceImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={faceImage} alt="Captured face" className="w-full h-full object-cover" />
              )}

              {/* Scan overlay */}
              {cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-40 rounded-full border-2 border-[rgba(182,160,255,0.6)] shadow-[0_0_0_4000px_rgba(0,0,0,0.35)]">
                    <div className="absolute inset-0 rounded-full border-t-2 border-[#b6a0ff] animate-spin" />
                  </div>
                  <p className="absolute bottom-4 text-xs text-[#aba9b9] bg-[rgba(0,0,0,0.5)] px-3 py-1 rounded-full">
                    Align your face within the circle
                  </p>
                </div>
              )}

              {/* Captured overlay */}
              {faceCaptured && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[rgba(104,250,221,0.15)] backdrop-blur-sm border border-[rgba(104,250,221,0.3)] text-[#68fadd] text-xs font-semibold px-3 py-1.5 rounded-full">
                  <CheckCircle2 size={12} /> Face Captured
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {cameraError && (
              <div className="mb-3 text-xs text-[#ff6b6b] flex items-center gap-1.5">
                <AlertTriangle size={13} /> {cameraError}
              </div>
            )}

            <div className="flex gap-3">
              {!cameraActive && !faceCaptured && (
                <button
                  id="start-camera-btn"
                  onClick={startCamera}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all"
                >
                  <Camera size={16} /> Start Camera
                </button>
              )}

              {cameraActive && (
                <>
                  <button
                    id="capture-face-btn"
                    onClick={captureFace}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-[#003830] bg-gradient-to-r from-[#68fadd] to-[#00bea3] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(104,250,221,0.3)] transition-all"
                  >
                    <ScanFace size={16} /> Capture & Verify Face
                  </button>
                  <button
                    onClick={stopCamera}
                    className="w-11 h-11 flex items-center justify-center rounded-xl border border-[rgba(71,71,84,0.4)] text-[#aba9b9] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </>
              )}

              {faceCaptured && (
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => { setFaceCaptured(false); setFaceImage(""); setStep("qr"); }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm text-[#aba9b9] border border-[rgba(71,71,84,0.3)] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] transition-colors"
                  >
                    <Camera size={14} /> Retake
                  </button>
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-[rgba(104,250,221,0.08)] border border-[rgba(104,250,221,0.2)] text-[#68fadd] text-sm font-medium">
                    <CheckCircle2 size={15} /> Face verified — ready to submit
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            id="mark-attendance-btn"
            onClick={handleMark}
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(126,81,255,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {isPending ? (
              <><Loader2 size={18} className="animate-spin" /> Verifying Identity...</>
            ) : (
              <><ShieldCheck size={18} /><Zap size={14} /> Mark Attendance</>
            )}
          </button>

          {!qrToken && (
            <p className="text-center text-xs text-[#aba9b9] -mt-4">
              Complete both steps above to enable submission
            </p>
          )}
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────── */}
        <div className="flex flex-col gap-0">
          <div className="bg-[#181826] rounded-2xl border border-[rgba(71,71,84,0.3)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-[rgba(71,71,84,0.25)]">
              <div className="w-9 h-9 rounded-xl bg-[rgba(182,160,255,0.1)] flex items-center justify-center text-[#b6a0ff]">
                <BookOpen size={17} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#e9e6f7]">My Enrolled Courses</h2>
                <p className="text-[11px] text-[#aba9b9]">Select a course to view attendance</p>
              </div>
              {!isLoading && courses.length > 0 && (
                <span className="ml-auto text-xs font-bold text-[#b6a0ff] bg-[rgba(182,160,255,0.1)] px-2.5 py-1 rounded-full">
                  {courses.length}
                </span>
              )}
            </div>

            {/* Course list */}
            <div className="divide-y divide-[rgba(71,71,84,0.15)]">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 animate-pulse">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-4 bg-[rgba(182,160,255,0.08)] rounded w-2/5" />
                      <div className="h-5 bg-[rgba(71,71,84,0.2)] rounded w-14" />
                    </div>
                    <div className="h-1.5 bg-[rgba(71,71,84,0.25)] rounded-full" />
                  </div>
                ))
              ) : courses.length > 0 ? (
                courses.map((enrollment: any) => {
                  const pct = enrollment.percentage ?? 0;
                  const isDefaulter = pct < 75;
                  const isSelected = selectedCourse?.id === enrollment._id;
                  return (
                    <div key={enrollment._id}>
                      <button
                        id={`course-${enrollment._id}`}
                        onClick={() =>
                          setSelectedCourse(
                            isSelected
                              ? null
                              : { id: enrollment._id, name: enrollment.course?.name ?? "Course" }
                          )
                        }
                        className={`w-full px-6 py-4 text-left transition-colors group ${
                          isSelected ? "bg-[rgba(182,160,255,0.05)]" : "hover:bg-[#12121e]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${isDefaulter ? "bg-[#ff6b6b]" : "bg-[#68fadd]"}`} />
                            <span className="text-sm font-semibold text-[#e9e6f7] truncate">
                              {enrollment.course?.name ?? "Unknown Course"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-md border flex items-center gap-1 ${
                              isDefaulter
                                ? "bg-[rgba(255,107,107,0.1)] text-[#ff6b6b] border-[rgba(255,107,107,0.2)]"
                                : "bg-[rgba(104,250,221,0.1)] text-[#68fadd] border-[rgba(104,250,221,0.2)]"
                            }`}>
                              {isDefaulter ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                              {pct}%
                            </span>
                            <ChevronRight
                              size={14}
                              className={`text-[#aba9b9] transition-transform duration-200 ${isSelected ? "rotate-90" : "group-hover:translate-x-0.5"}`}
                            />
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className={`w-full rounded-full h-1.5 ${isDefaulter ? "bg-[rgba(255,107,107,0.1)]" : "bg-[rgba(104,250,221,0.08)]"}`}>
                          <div
                            className={`h-1.5 rounded-full transition-all duration-700 ${
                              isDefaulter
                                ? "bg-[#ff6b6b] shadow-[0_0_8px_rgba(255,107,107,0.5)]"
                                : "bg-[#68fadd] shadow-[0_0_8px_rgba(104,250,221,0.5)]"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                          />
                        </div>

                        {isDefaulter && (
                          <p className="mt-2 text-[10px] text-[#ff6b6b] flex items-center gap-1 opacity-80">
                            <AlertTriangle size={10} /> Below 75% threshold — at risk!
                          </p>
                        )}
                      </button>

                      {/* Expanded detail */}
                      {isSelected && (
                        <div className="px-6 pb-5">
                          <AttendanceDetail courseId={enrollment._id} courseName={enrollment.course?.name ?? "Course"} />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <div className="w-14 h-14 rounded-2xl bg-[rgba(182,160,255,0.06)] flex items-center justify-center mb-3">
                    <Users size={24} className="text-[#aba9b9]" />
                  </div>
                  <p className="text-sm font-medium text-[#e9e6f7]">No enrolled courses</p>
                  <p className="text-xs text-[#aba9b9] mt-1 text-center">Contact your manager to enroll in courses.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}