import api from "@/config/axios";

export const getCourses = async () => {
    const response = await api.get("/api/course/teacher");
    return response.data;
};
