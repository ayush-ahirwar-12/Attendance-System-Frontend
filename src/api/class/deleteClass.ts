import api from "@/config/axios"

export const deleteClass = async(id:string)=>{
    const response = await api.delete(`/api/class/delete/${id}`)
    return response.data;
}