import api from "@/config/axios";

export const overrideRecord = async (recordId: string, data: any) => {
    const response = await api.patch(`/api/attendance/records/${recordId}`, data);
    return response.data;
};
