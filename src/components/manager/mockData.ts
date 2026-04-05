import type { Course, Teacher, Student, ClassItem } from './types';

export const TEACHERS: Teacher[] = [
  { id: 't1', name: 'Dr. Sarah Johnson',   initials: 'SJ', email: 'sarah@attendai.edu',   department: 'CS' },
  { id: 't2', name: 'Prof. Ravi Mehta',    initials: 'RM', email: 'ravi@attendai.edu',    department: 'CS' },
  { id: 't3', name: 'Dr. Ananya Sharma',   initials: 'AS', email: 'ananya@attendai.edu',  department: 'Math' },
  { id: 't4', name: 'Prof. James Wilson',  initials: 'JW', email: 'james@attendai.edu',   department: 'ECE' },
  { id: 't5', name: 'Dr. Priya Kapoor',    initials: 'PK', email: 'priya@attendai.edu',   department: 'CS' },
];

export const STUDENTS: Student[] = [
  { id: 's1',  name: 'Aarav Sharma',  initials: 'AS', rollNo: 'CS21001', department: 'CS' },
  { id: 's2',  name: 'Priya Singh',   initials: 'PS', rollNo: 'CS21002', department: 'CS' },
  { id: 's3',  name: 'Rahul Verma',   initials: 'RV', rollNo: 'CS21003', department: 'CS' },
  { id: 's4',  name: 'Ananya Patel',  initials: 'AP', rollNo: 'CS21004', department: 'CS' },
  { id: 's5',  name: 'Vikram Kumar',  initials: 'VK', rollNo: 'CS21005', department: 'CS' },
  { id: 's6',  name: 'Sneha Reddy',   initials: 'SR', rollNo: 'CS21006', department: 'CS' },
  { id: 's7',  name: 'Arjun Nair',    initials: 'AN', rollNo: 'CS21007', department: 'ECE' },
  { id: 's8',  name: 'Meera Iyer',    initials: 'MI', rollNo: 'CS21008', department: 'Math' },
  { id: 's9',  name: 'Rohan Gupta',   initials: 'RG', rollNo: 'CS21009', department: 'CS' },
  { id: 's10', name: 'Kavya Menon',   initials: 'KM', rollNo: 'CS21010', department: 'CS' },
  { id: 's11', name: 'Aditya Roy',    initials: 'AR', rollNo: 'CS21011', department: 'CS' },
  { id: 's12', name: 'Nisha Bose',    initials: 'NB', rollNo: 'CS21012', department: 'Math' },
];

export const INITIAL_COURSES: Course[] = [
  { id: 'c1', code: 'CS301', name: 'Algorithm Design',    department: 'CS',   teacherId: 't1', status: 'Active'   },
  { id: 'c2', code: 'CS205', name: 'Data Structures',     department: 'CS',   teacherId: 't2', status: 'Active'   },
  { id: 'c3', code: 'CS401', name: 'Machine Learning',    department: 'CS',   teacherId: null, status: 'Inactive' },
  { id: 'c4', code: 'CS102', name: 'Python Programming',  department: 'CS',   teacherId: 't3', status: 'Active'   },
  { id: 'c5', code: 'EC201', name: 'Digital Electronics', department: 'ECE',  teacherId: 't4', status: 'Active'   },
];

export const INITIAL_CLASSES: ClassItem[] = [
  {
    id: 'cl1', section: 'A', courseId: 'c1',
    schedule: { days: ['Mon', 'Wed', 'Fri'], from: '09:00', to: '10:00' },
    classroomName: 'Room 201', lat: 28.6139, lng: 77.2090, radius: 50,
    studentIds: ['s1', 's2', 's3', 's4', 's5'],
  },
  {
    id: 'cl2', section: 'B', courseId: 'c1',
    schedule: { days: ['Tue', 'Thu'], from: '11:00', to: '12:30' },
    classroomName: 'Room 105', lat: 28.6140, lng: 77.2091, radius: 50,
    studentIds: ['s6', 's7', 's8'],
  },
  {
    id: 'cl3', section: 'A', courseId: 'c2',
    schedule: { days: ['Mon', 'Wed'], from: '14:00', to: '15:30' },
    classroomName: 'Room 301', lat: 28.6141, lng: 77.2092, radius: 75,
    studentIds: ['s9', 's10', 's11', 's12'],
  },
  {
    id: 'cl4', section: 'A', courseId: 'c4',
    schedule: { days: ['Fri'], from: '16:00', to: '17:30' },
    classroomName: 'Lab 404', lat: 28.6142, lng: 77.2093, radius: 30,
    studentIds: ['s1', 's3', 's5', 's7'],
  },
];
