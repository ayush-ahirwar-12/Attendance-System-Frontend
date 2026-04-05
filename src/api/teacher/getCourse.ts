import api from "@/config/axios"

export const getCourses = async()=>{
    const response = await api.get("/api/class/getclass");
    return response.data.data;
}