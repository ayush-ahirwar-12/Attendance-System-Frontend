import api from "@/config/axios";

export const getLiveSession = async (sessionId: string) => {
    const response = await api.get(`/api/session/${sessionId}`);
    return response.data;
};
