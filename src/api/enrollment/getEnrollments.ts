import api from "@/config/axios";

export interface EnrollmentRecord {
  _id: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  class: {
    _id: string;
    section: string;
    name: string;
  };
  course: {
    _id: string;
    code: string;
    name: string;
  } | null;
  status: "active" | "dropped" | "completed";
  createdAt: string;
}

/** Fetch enrollments for a single class */
export const getEnrollmentsByClass = async (classId: string): Promise<EnrollmentRecord[]> => {
  const response = await api.get(`/api/enrollment/class/${classId}`);
  const raw = response.data;
  if (Array.isArray(raw)) return raw;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  return [];
};

/**
 * Fetch ALL enrollments from the backend using a single API call.
 */
export const getAllEnrollments = async (): Promise<EnrollmentRecord[]> => {
  const response = await api.get('/api/enrollment');
  const raw = response.data;
  if (Array.isArray(raw)) return raw;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  return [];
};
