import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api";

export const useUpdateUser=()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["User"],
        mutationFn:(payload:api.UpdateProfilePayload)=>api.updateUser(payload),
        onSuccess:()=>queryClient.invalidateQueries({queryKey:["User"]})
    })
}

export const useGetTeachers = () => {
    return useQuery({
        queryKey: ["teachers"],
        queryFn: api.getTeachers,
        retry: 0
    })
}

