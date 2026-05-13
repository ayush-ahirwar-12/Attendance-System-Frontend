import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import { ManualMarkPayload, OverrideRecordPayload, MarkAttendancePayload } from "../types";

export const useGetMyAttendance = (courseId: string) => {
    return useQuery<any, Error>({
        queryKey: ["myAttendance", courseId],
        queryFn: () => api.getMyAttendance(courseId),
        enabled: !!courseId,
    });
};

export const useManualMark = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { sessionId: string; data: ManualMarkPayload }>({
        mutationFn: ({ sessionId, data }) => api.manualMark(sessionId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["liveSession", variables.sessionId] });
        }
    });
};

export const useMarkAttendance = () => {
    return useMutation<any, Error, MarkAttendancePayload>({
        mutationFn: (data) => api.markAttendance(data),
    });
};

export const useOverrideRecord = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { recordId: string; data: OverrideRecordPayload }>({
        mutationFn: ({ recordId, data }) => api.overrideRecord(recordId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["liveSession"] });
        }
    });
};
