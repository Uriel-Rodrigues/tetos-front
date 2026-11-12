import { useMutation } from "@tanstack/react-query"
import { AXIOS } from "../services"

//criação de um hook personalizado que vai fazer parte do contexto onde os outros componentes podem usar
export const useLogin = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/login", dados)
            return res.data

        }
    })
}