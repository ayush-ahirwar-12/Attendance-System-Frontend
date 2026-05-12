import api from "@/config/axios";
import { CreateRequestPayload } from "@/features/lecture/types";

export const createRequest = async (data: CreateRequestPayload) => {
    const response = await api.post("/api/lecture/request", data);
    return response.data;
};
