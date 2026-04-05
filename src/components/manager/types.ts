export type ManagerPage = 'dashboard' | 'courses' | 'classes' | 'reports';

export interface Teacher {
  id: string;
  name: string;
  initials: string;
  email: string;
  department: string;
}

export interface Student {
  id: string;
  name: string;
  initials: string;
  rollNo: string;
  department: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  teacherId: string | null;
  status: 'Active' | 'Inactive';
}

export interface ClassItem {
  id: string;
  section: string;
  courseId: string;
  schedule: { days: string[]; from: string; to: string };
  classroomName: string;
  lat: number;
  lng: number;
  radius: number;
  studentIds: string[];
}
