import api from "@/config/axios";

export const closeSession = async (sessionId: string) => {
    const response = await api.post(`/api/session/${sessionId}/close`);
    return response.data;
};
