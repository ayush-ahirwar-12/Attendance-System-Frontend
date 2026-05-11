import api from "@/config/axios";

export const createSemester = async (data:FormData) => {
    const response = await api.post("/api/semester/create", data);
    return response.data;
}