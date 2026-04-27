import api from "@/config/axios"
import { useQuery } from "@tanstack/react-query";

export const getAllCourses = async()=>{
    const response = await api.get("/api/course/allcourses");
    
    return response.data;
}

