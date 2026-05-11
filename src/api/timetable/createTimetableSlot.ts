import api from "@/config/axios";

export const createTimetableSlot = async (data: any) => {
    const response = await api.post("/api/timetable/create", data)
    return response.data;
};
