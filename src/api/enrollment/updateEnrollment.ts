import api from "@/config/axios";

export interface UpdateEnrollmentPayload {
  status?: "active" | "dropped" | "completed";
  class?: string;
  course?: string | null;
}

export const updateEnrollment = async (
  id: string,
  body: UpdateEnrollmentPayload
) => {
  const response = await api.put(`/api/enrollment/${id}`, body);
  return response.data;
};
