export type ManagerPage = 'dashboard' | 'courses' | 'classes' | 'reports';

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
  email:string

}

export interface Course {
  _id: string;
  code: string;
  name: string;
  class: string;
  teacher?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassItem {
  _id:string,
  section:string,
  name:string,
  students:string[],
  latitude:number,
  longitude:number,
  radius:number,
  courses:any[]
}
