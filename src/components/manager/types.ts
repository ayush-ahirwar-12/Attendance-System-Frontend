export type ManagerPage = 'dashboard' | 'courses' | 'classes' | 'reports' | 'users';

export interface Teacher {
  id: string;
  name: string;
  initials: string;
  email: string;
  department: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  initials:string,
  rollNo:string,
  department:string

}

export interface Course {
  _id: string;
  code: string;
  name: string;
  class: string;
  type: 'compulsory' | 'elective';
  teacher?: string | null;
}

export interface ClassItem {
  _id: string,
  section: string,
  name: string,
  students: string[],
  latitude: number,
  longitude: number,
  radius: number,
  courses: any[]
}
