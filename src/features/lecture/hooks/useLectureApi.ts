import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import { CreateRequestPayload, ReviewRequestPayload } from "../types";

export const useCreateRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: CreateRequestPayload) => api.createRequest(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myRequests"] });
        }
    });
};

export const useGetMyRequests = () => {
    return useQuery({
        queryKey: ["myRequests"],
        queryFn: api.getMyRequests,
    });
};

export const useGetPendingRequests = () => {
    return useQuery({
        queryKey: ["pendingRequests"],
        queryFn: api.getPendingRequests,
    });
};

export const useReviewRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => api.reviewRequest(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
        }
    });
};

export const useGetTodaySchedule = () => {
    return useQuery({
        queryKey: ["todaySchedule"],
        queryFn: api.getTodaySchedule,
    });
};

export const useGetWeekSchedule = () => {
    return useQuery({
        queryKey: ["weekSchedule"],
        queryFn: api.getWeekSchedule,
    });
};

export const useUpdateTopic = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, topic }: { id: string; topic: string }) => api.updateTopic(id, topic),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todaySchedule"] });
            queryClient.invalidateQueries({ queryKey: ["weekSchedule"] });
        }
    });
};

export const useGenerateLectures = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (semesterId: string) => api.generateLectures(semesterId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todaySchedule"] });
            queryClient.invalidateQueries({ queryKey: ["weekSchedule"] });
        }
    });
};
