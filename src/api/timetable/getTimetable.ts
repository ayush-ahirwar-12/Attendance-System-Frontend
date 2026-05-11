import api from "@/config/axios";

export const getTimetable = async (semesterId: string) => {
    const response = await api.get(`/api/timetable/${semesterId}`);
    return response.data;
};
