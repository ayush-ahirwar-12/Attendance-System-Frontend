import api from "@/config/axios";
import { ManualMarkPayload } from "@/features/attendance/types";

export const manualMark = async (sessionId: string, data: ManualMarkPayload) => {
    const response = await api.post(`/api/attendance/${sessionId}/markmanual`, data);
    return response.data;
};
