import api from "@/config/axios";

export const createRequest = async (data: any) => {
    const response = await api.post("/api/lecture/request", data);
    return response.data;
};
