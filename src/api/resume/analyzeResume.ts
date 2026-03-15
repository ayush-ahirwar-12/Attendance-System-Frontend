import api from "@/config/axios";

export const analyzeResume = (resumeId: string) => {
  return api.post(`/api/ai/analyze/${resumeId}`);
};