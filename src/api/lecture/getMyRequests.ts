import api from "@/config/axios";

export const getMyRequests = async () => {
    const response = await api.get("/api/lecture/requests/teacher");
    return response.data;
};
