import api from "@/config/axios"

export const updateClass = async ({ id, data }: { id: string, data: any }) => {
    const response = await api.patch(`/api/class/update/${id}`, data)
    return response.data
}