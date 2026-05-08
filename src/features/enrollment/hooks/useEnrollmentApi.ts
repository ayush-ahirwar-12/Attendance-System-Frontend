import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";

/* ── Create enrollment ─────────────────────────────────────────────── */
export const useEnrollStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: api.EnrollStudentPayload) => api.enrollStudent(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollments"] });
        },
    });
};

/* ── Fetch enrollments for a specific class ────────────────────────── */
export const useGetEnrollments = (classId: string) => {
    return useQuery({
        queryKey: ["enrollments", classId],
        queryFn: () => api.getEnrollmentsByClass(classId),
        enabled: !!classId,
    });
};

/**
 * Fetch ALL enrollments using the single /api/enrollment endpoint.
 */
export const useGetAllEnrollments = () => {
    return useQuery({
        queryKey: ["enrollments", "all"],
        queryFn: () => api.getAllEnrollments(),
    });
};

/* ── Update enrollment ─────────────────────────────────────────────── */
export const useUpdateEnrollment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: api.UpdateEnrollmentPayload }) =>
            api.updateEnrollment(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollments"] });
        },
    });
};

/* ── Delete enrollment ─────────────────────────────────────────────── */
export const useDeleteEnrollment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.deleteEnrollment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollments"] });
        },
    });
};
