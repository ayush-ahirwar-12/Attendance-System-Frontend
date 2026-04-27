import api from "@/config/axios"

export const createCourse = async(body:FormData)=>{
    const response = await api.post('/api/course/create', body);
    return response.data
}