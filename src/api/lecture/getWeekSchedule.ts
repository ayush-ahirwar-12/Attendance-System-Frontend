import api from "@/config/axios";

export const getWeekSchedule = async () => {
    const response = await api.get("/api/lecture/teacher/week");
    return response.data;
};
