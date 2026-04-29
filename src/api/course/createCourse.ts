import { Course } from "@/components/manager/types";
import api from "@/config/axios"

export const createCourse = async(body:Omit<Course, "_id">)=>{
    const response = await api.post('/api/course/create', body);
    return response.data
}