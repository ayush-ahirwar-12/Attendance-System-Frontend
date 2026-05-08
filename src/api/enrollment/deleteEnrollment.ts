import api from "@/config/axios";

export const deleteEnrollment = async (id: string) => {
  const response = await api.delete(`/api/enrollment/${id}`);
  return response.data;
};
