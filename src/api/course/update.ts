import api from "@/config/axios"

export const updateCourse = async(id:String,body:FormData)=>{
    const response = await api.patch(`/api/course/update/${id}`,body);
    return response.data;
}