import api from "@/config/axios"

export const updateTopic = async(id:string,topic:string)=>{
    const response = await api.patch(`/api/lecture/${id}/topic`,topic)
    return response.data
}