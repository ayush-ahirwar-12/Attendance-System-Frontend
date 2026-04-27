import api from "@/config/axios";

export const getTeachers = async () => {
    const response = await api.get("/api/auth/allteachers");
    return response.data;
}


