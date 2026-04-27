import api from "@/config/axios";

export const createClass = async (classData: any) => {
    const response = await api.post("/api/class/create", classData);
    return response.data;
};
