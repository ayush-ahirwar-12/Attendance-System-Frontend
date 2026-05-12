import api from "@/config/axios";
import { MarkAttendancePayload } from "@/features/attendance/types";

export const markAttendance = async (data: MarkAttendancePayload) => {
    const response = await api.post(`/api/attendance/markattendance`, data);
    return response.data;
};