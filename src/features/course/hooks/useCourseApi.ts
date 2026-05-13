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

export const useGetTeacherCourses = () => {
    return useQuery({
        queryKey: ["teacherCourses"],
        queryFn: api.getCourses,
    });
};

export const useGetCourseStudents = (courseId: string) => {
    return useQuery({
        queryKey: ["courseStudents", courseId],
        queryFn: () => api.getCourseStudents(courseId),
        enabled: !!courseId,
    });
};


export const useGetMyCourses = () => {
    return useQuery({
        queryKey: ["myCourses"],
        queryFn: api.getMyCourse,
    });
};