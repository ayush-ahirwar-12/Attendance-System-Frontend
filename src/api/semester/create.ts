import api from "@/config/axios";
import { CreateSemesterPayload } from "@/features/semester/types";

export const createSemester = async (data: CreateSemesterPayload) => {
    const response = await api.post("/api/semester/create", data);
    return response.data;
}