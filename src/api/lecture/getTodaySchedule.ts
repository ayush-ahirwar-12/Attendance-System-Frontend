import api from "@/config/axios";

export const getTodaySchedule = async () => {
    const response = await api.get("/api/lecture/teacher/today");
    return response.data;
};
