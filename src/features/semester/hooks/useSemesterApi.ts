import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import { Semester, CreateSemesterPayload, UpdateSemesterStatusPayload } from "../types";

export const useSemesters = () => {
    return useQuery<Semester[]>({
        queryKey: ["semesters"],
        queryFn: api.getAllSemester,
    });
};

export const useCreateSemester = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateSemesterPayload) => api.createSemester(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["semesters"] });
        }
    });
};

export const useUpdateSemesterStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: UpdateSemesterStatusPayload) => api.updateSemesterStatus(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["semesters"] });
        }
    });
};
