export type AttendanceMethod = "face" | "qr" | "manual";
export type AttendanceStatus = "present" | "absent" | "late";

export interface Student {
  id: string;
  name: string;
  studentId: string;
  avatarUrl: string;
  status: AttendanceStatus;
  checkInTime?: string;
  method?: AttendanceMethod;
  isLive?: boolean;
}

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

export interface ScheduleSession {
  title: string;
  time: string;
  location: string;
  isCurrent?: boolean;
}

export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  color: "secondary" | "error" | "amber" | "primary";
  badge?: string;
  sub?: string;
  progress?: number;
}