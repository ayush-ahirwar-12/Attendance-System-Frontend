import api from "@/config/axios";

export const startSession = async (data: FormData) => {
    const response = await api.post("/api/session/start", data);
    return response.data;
};
