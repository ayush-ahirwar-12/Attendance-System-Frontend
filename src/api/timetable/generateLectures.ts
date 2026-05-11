import api from "@/config/axios";

export const generateLectures = async (semesterId: string) => {
    const response = await api.post("/manager/timetable/generate", { semesterId });
    return response.data;
};
