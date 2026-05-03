import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api";

export const useGetClasses = ()=>{
    return useQuery({
        queryKey:["classes"],
        queryFn:api.getClasses,
        retry:0
    })
};

export const useCreateClass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.createClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        }
    });
};

export const useUpdateClass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        }
    });
};

export const useDeleteClass = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        }
    })
}