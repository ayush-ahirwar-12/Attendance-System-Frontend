import api from "@/config/axios"

export const deleteCourse = async(id:string) => {
    const response = await api.delete(`/api/course/delete/${id}`);
    return response.data;
}   