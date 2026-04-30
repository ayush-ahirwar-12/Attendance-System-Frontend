import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api";

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["User"],
        mutationFn: (payload: api.UpdateProfilePayload) => api.updateUser(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["User"] })
    })
}

export const useGetTeachers = () => {
    return useQuery({
        queryKey: ["teachers"],
        queryFn: api.getTeachers,
        retry: 0
    })
}

export const useGetAllUsers = (params: api.GetAllUsersParams) => {
    return useQuery({
        queryKey: ["allUsers", params],
        queryFn: () => api.getAllUsers(params),
        retry: 0
    })
}

export const useUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: api.AssignRolePayload) => api.updateRole(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allUsers"] })
    })
}

export const useGetStudents = () => {
    return useQuery({
        queryKey: ["students"],
        queryFn: api.getStudents,
        retry: 0
    })
}


