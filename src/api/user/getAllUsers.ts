import api from "@/config/axios";

export interface GetAllUsersParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const getAllUsers = async (params: GetAllUsersParams = {}) => {
    const { page = 1, limit = 10, search = "" } = params;
    const response = await api.get("/api/auth/allusers", {
        params: { page, limit, search },
    });
    return response.data.data;
};


