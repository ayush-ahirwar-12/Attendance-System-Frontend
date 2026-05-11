import api from "@/config/axios";

export const deleteHoliday = async (id: string) => {
    const response = await api.delete(`/api/holiday/${id}`);
    return response.data;
}