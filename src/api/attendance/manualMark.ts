import api from "@/config/axios";

export const manualMark = async (sessionId: string, data: any) => {
    const response = await api.post(`/api/attendance/${sessionId}/markmanual`, data);
    return response.data;
};
