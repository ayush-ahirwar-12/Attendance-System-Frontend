import api from "@/config/axios"

export const getClasses = async()=>{
    const response = await api.get("/api/class/getallclass");
    return response.data.data;
}