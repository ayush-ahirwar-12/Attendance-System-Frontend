import api from "@/config/axios";

export const getHolidays = async (semesterId: string) => {
    const response = await api.get(`/api/holiday/semester/${semesterId}`);
    return response.data;
}   