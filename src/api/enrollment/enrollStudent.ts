import api from "@/config/axios";

export interface EnrollStudentPayload {
  student: string;                              // ObjectId ref 'users'
  classId: string;                               // ObjectId ref 'classes'
  courseId?: string | null;                      // ObjectId ref 'courses' — null = compulsory
  status?: "active" | "dropped" | "completed";
}

export const enrollStudent = async (body: EnrollStudentPayload) => {
  const response = await api.post("/api/enrollment", body);
  return response.data;
};
