import api from "@/config/axios"

export const updateCourse = async(id: string, body: any)=>{
    const response = await api.patch(`/api/course/update/${id}`, body);
    return response.data;
}