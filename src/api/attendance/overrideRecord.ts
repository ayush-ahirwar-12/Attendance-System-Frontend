import api from "@/config/axios";
import { OverrideRecordPayload } from "@/features/attendance/types";

export const overrideRecord = async (recordId: string, data: OverrideRecordPayload) => {
    const response = await api.patch(`/api/attendance/records/${recordId}`, data);
    return response.data;
};
