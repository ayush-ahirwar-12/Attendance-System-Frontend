import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import { ManualMarkPayload, OverrideRecordPayload, MarkAttendancePayload } from "../types";

export const useGetMyAttendance = (courseId: string) => {
    return useQuery({
        queryKey: ["myAttendance", courseId],
        queryFn: () => api.getMyAttendance(courseId),
        enabled: !!courseId,
    });
};

export const useManualMark = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ sessionId, data }: { sessionId: string; data: ManualMarkPayload }) => api.manualMark(sessionId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["liveSession", variables.sessionId] });
        }
    });
};

export const useMarkAttendance = () => {
    return useMutation({
        mutationFn: (data: MarkAttendancePayload) => api.markAttendance(data),
    });
};

export const useOverrideRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ recordId, data }: { recordId: string; data: OverrideRecordPayload }) => api.overrideRecord(recordId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["liveSession"] });
        }
    });
};
