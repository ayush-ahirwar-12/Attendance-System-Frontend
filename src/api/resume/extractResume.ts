import api from "@/config/axios";

export const extractResume = (resumeId: string) => {
  return api.post(`/api/aws/extract/${resumeId}`);
};