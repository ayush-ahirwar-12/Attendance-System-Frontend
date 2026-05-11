import api from "@/config/axios";

export const createHoliday = async (data:FormData) => {
    const response = await api.post("/api/holiday/create", data);
    return response.data;
}