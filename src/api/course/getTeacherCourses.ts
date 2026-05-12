import api from "@/config/axios";

export const getCourses = async () => {
    const response = await api.get("/teacher/courses");
    return response.data;
};
