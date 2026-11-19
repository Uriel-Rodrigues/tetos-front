import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services"

//criação de um hook personalizado que vai fazer parte do contexto onde os outros componentes podem usar
export const useLogin = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/login", dados)
            return res.data

        }
    })
}

export const useBuscarUsuario = () =>{
    return useQuery({
        queryKey: ["usuarios"],
        queryFn: async () => {
            const res = await AXIOS.get("/usuarios");
            return res.data;
        }
    })
}

export const useCriarUsuario = () => {
    return useMutation ({
        mutationFn: async (dados) => {
            const res = await AXIOS.post ("/usuarios", dados);
            return res.data
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({ //aqui invalidamos um query, quando fazemos isso ele refaz as querys com a chave indicada atualizando os registros 
                queryKey: ["usuarios"]
            })
        }
    })
}

export const useEditarUsuario = () => {
    return useMutation ({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/usuarios/${dados.id}`, dados);
            return res.data
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({ //aqui invalidamos um query, quando fazemos isso ele refaz as querys com a chave indicada atualizando os registros 
                queryKey: ["usuarios"]
            })
        }
    })
}

export const useDeletarUsuario = () => {
    return useMutation ({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/usuarios/${id}`, dados);
            return res.data
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({ //aqui invalidamos um query, quando fazemos isso ele refaz as querys com a chave indicada atualizando os registros 
                queryKey: ["usuarios"]
            })
        }
    })
}