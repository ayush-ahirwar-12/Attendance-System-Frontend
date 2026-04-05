export type ManagerPage = 'dashboard' | 'courses' | 'teachers' | 'students' | 'classrooms' | 'reports';

export interface Course {
  id: string;
  code: string;
  name: string;
  teacher: string;
  teacherInitials: string;
  students: number;
  capacity: number;
  status: 'Active' | 'Inactive' | 'Upcoming';
  department: string;
  schedule: string;
}

export interface Teacher {
  id: string;
  name: string;
  initials: string;
  email: string;
  department: string;
  courses: string[];
  status: 'Active' | 'On Leave';
}

export interface Student {
  id: string;
  name: string;
  initials: string;
  rollNo: string;
  email: string;
  department: string;
  courses: string[];
  attendance: number;
}

export interface Classroom {
  id: string;
  name: string;
  building: string;
  capacity: number;
  lat: number;
  lng: number;
  radius: number;
  status: 'Active' | 'Inactive';
}
