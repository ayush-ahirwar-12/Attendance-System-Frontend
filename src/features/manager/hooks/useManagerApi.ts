import {useQuery } from "@tanstack/react-query"
import * as api from "@/api";

export const useFetchCourses = ()=>{
    return useQuery({
        queryKey:["courses"],
        queryFn:api.getCourses,
        retry:0
    })
};