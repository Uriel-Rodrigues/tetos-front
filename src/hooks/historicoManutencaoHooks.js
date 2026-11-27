import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services"

export const useBuscarHistoricoManutencao = () => {
    return useQuery({
        queryKey:["historico-manutencoes"],
        queryFn: async () => {
            const res = await AXIOS.get("/historico-manutencoes")
            return res.data
        }
    })
}

export const useCriarHistoricoManutencao= () => {
    return useMutation ({
        mutationFn: async (dados) => {
            const res = await AXIOS.post ("/historico-manutencoes", dados);
            return res.data
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({ //aqui invalidamos um query, quando fazemos isso ele refaz as querys com a chave indicada atualizando os registros 
                queryKey: ["historico-manutencoes"]
            })
        }
    })
}

export const useEditarHistoricoManutencao = () => {
    return useMutation ({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/historico-manutencoes/${dados.id}`, dados);
            return res.data
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({ //aqui invalidamos um query, quando fazemos isso ele refaz as querys com a chave indicada atualizando os registros 
                queryKey: ["historico-manutencoes"]
            })
        }
    })
}

export const useDeletarHistoricoManutencao = () => {
    return useMutation ({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/historico-manutencoes/${id}`);
            return res.data
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({ //aqui invalidamos um query, quando fazemos isso ele refaz as querys com a chave indicada atualizando os registros 
                queryKey: ["historico-manutencoes"]
            })
        }
    })
}