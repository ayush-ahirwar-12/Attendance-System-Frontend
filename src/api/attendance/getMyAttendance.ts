import api from "@/config/axios"

export const getMyAttendance = async(courseId:string)=>{
    const response = await api.get(`/api/attendance/getmyattendance/${courseId}`)
    return response.data;
}
