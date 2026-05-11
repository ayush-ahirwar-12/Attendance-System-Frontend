import api from "@/config/axios";

export const reviewRequest = async (id: string, status: string) => {
    const response = await api.patch(`/api/lecture/requests/${id}`, { status });
    return response.data;
};
