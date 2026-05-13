import api from "@/config/axios";

export const getMyCourse = async () => {
    const response = await api.get("/api/course/mycourses");
    return response.data;
}