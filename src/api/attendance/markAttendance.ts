import api from "@/config/axios"

export const markAttendance = async()=>{
    const response = await api.post(`/api/attendance/markattendance`)
    return response.data    
}