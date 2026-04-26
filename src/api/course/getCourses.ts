import api from "@/config/axios"

export const getAllCourses = async()=>{
    const response = await api.get("/api/course/allcourses");
    return response.data;
}