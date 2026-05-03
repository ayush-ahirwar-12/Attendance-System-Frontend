import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api";
import { Course } from "@/components/manager/types";

export const useGetCourses = () => {
    return useQuery({
        queryKey: ["allCourses"],
        queryFn: api.getAllCourses,
        retry: 0
    })
}

export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: Omit<Course, "_id">) => api.createCourse(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allCourses"] });
        }
    });
};

export const useUpdateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: any }) => api.updateCourse(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allCourses"] });
        }
    });
};

export const useDeleteCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.deleteCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allCourses"] });    
        }
    });
};