import * as api from "@/api"
import { useMutation } from "@tanstack/react-query"

export const useRegisterApi = () => {
    return useMutation({
        mutationKey:["register"],
        mutationFn: (data:FormData) => api.register(data),
        retry:0
    })
}

export const useLogin = () => {
    return useMutation({
        mutationKey: ["login"],
        mutationFn: (data: FormData) => api.login(data),
        retry: 0
    })
}

export const useVerify = ()=>{
    return useMutation({
        mutationKey:["verify"],
        mutationFn:(userId:string)=>api.verifyUser(userId)
    })
}

