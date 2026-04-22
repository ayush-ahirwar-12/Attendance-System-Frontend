import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api";

export const useFetchCourses = ()=>{
    return useQuery({
        queryKey:["courses"],
        queryFn:api.getCourses,
        retry:0
    })
};

export const useCreateClass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.createClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        }
    });
};