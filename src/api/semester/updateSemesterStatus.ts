import api from "@/config/axios";

export const updateSemesterStatus = async (id: string, data: { status: string }) => {
    const response = await api.patch(`/api/semester/update/${id}`, data);
    return response.data;
}   