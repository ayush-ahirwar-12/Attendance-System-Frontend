import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import { SessionRecord, SessionResponse } from "../types";

export const useStartSession = () => {
    return useMutation<SessionResponse, Error, FormData>({
        mutationFn: (data: FormData) => api.startSession(data),
    });
};

export const useGetLiveSession = (sessionId: string) => {
    return useQuery<SessionRecord[], Error>({
        queryKey: ["liveSession", sessionId],
        queryFn: () => api.getLiveSession(sessionId),
        enabled: !!sessionId,
        refetchInterval: 5000, // Poll for live updates every 5 seconds
    });
};

export const useCloseSession = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: (sessionId: string) => api.closeSession(sessionId),
        onSuccess: (_, sessionId) => {
            queryClient.invalidateQueries({ queryKey: ["liveSession", sessionId] });
        }
    });
};
