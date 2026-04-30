import api from "@/config/axios"

export const getStudents = async ()=>{
    const response = await api.get("/api/auth/allstudents");
    return response.data
}