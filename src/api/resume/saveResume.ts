import api from "@/config/axios";

export const saveResume = (data: {
  fileName: string;
  key: string;
}) => {
  return api.post("/api/aws/save", data);
};
