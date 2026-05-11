import api from "@/config/axios";

export const getAllSemester = async () => {
    const response = await api.get("/api/semester/getallsemester");
    return response.data;
}