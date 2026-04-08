import api from "@/config/axios"

export const getCourses = async()=>{
    const response = await api.get("/api/class/getallclass");
    return response.data.data;
}