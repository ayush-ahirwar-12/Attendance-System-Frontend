import { NavItem, ScheduleSession, Student } from "./types";


export const NAV_ITEMS: NavItem[] = [
  { icon: "dashboard",     label: "Dashboard",          href: "/",         active: true },
  { icon: "calendar_month",label: "Attendance History", href: "/history" },
  { icon: "group",         label: "Student Directory",  href: "/students" },
  { icon: "qr_code_2",     label: "QR Generator",       href: "/qr" },
  { icon: "settings",      label: "Settings",           href: "/settings" },
];

export const BOTTOM_NAV: NavItem[] = [
  { icon: "help",   label: "Help Center", href: "/help" },
  { icon: "logout", label: "Sign Out",    href: "/signout" },
];

export const STUDENTS: Student[] = [
  {
    id: "1",
    name: "Marcus Holloway",
    studentId: "#CS-2024-042",
    avatarUrl: "https://i.pravatar.cc/48?img=11",
    status: "present",
    checkInTime: "09:05 AM",
    method: "face",
    isLive: true,
  },
  {
    id: "2",
    name: "Elena Rodriguez",
    studentId: "#CS-2024-019",
    avatarUrl: "https://i.pravatar.cc/48?img=47",
    status: "late",
    checkInTime: "09:03 AM",
    method: "qr",
  },
  {
    id: "3",
    name: "Jordan Smith",
    studentId: "#CS-2024-088",
    avatarUrl: "https://i.pravatar.cc/48?img=32",
    status: "present",
    checkInTime: "08:58 AM",
    method: "face",
  },
];

export const SCHEDULE: ScheduleSession[] = [
  {
    title: "CS101: Introduction to Web Design",
    time: "09:00 AM – 10:30 AM",
    location: "Lab 04",
    isCurrent: true,
  },
  {
    title: "CS302: Data Structures & Algorithms",
    time: "11:00 AM – 12:30 PM",
    location: "Room 202",
  },
  {
    title: "CS205: Database Systems",
    time: "02:00 PM – 03:30 PM",
    location: "Room 108",
  },
];