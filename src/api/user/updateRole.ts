import api from "@/config/axios";

export interface AssignRolePayload {
    userId: string;
    roleId: string;
}

export const updateRole = async (payload: AssignRolePayload) => {
    const response = await api.put(`/api/auth/${payload.userId}/role`, {
        roleId: payload.roleId,
    });
    return response.data;
};