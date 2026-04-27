import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api";

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
        mutationFn: (body: FormData) => api.createCourse(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allCourses"] });
        }
    });
};