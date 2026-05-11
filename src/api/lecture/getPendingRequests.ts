import api from "@/config/axios";

export const getPendingRequests = async () => {
    const response = await api.get("/api/lecture/requests/pending");
    return response.data;
};
