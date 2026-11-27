// import { Navigate } from "react-router";
//import { AXIOS } from "../services";
// import { useContext } from "react";
//import { AdminContext } from "../contexts/AdminProvaider";

// const RotaProtegida = ({ children }) => {

//     const {token, logout} = useContext(AdminContext) //pegando o contexto do admin provider

//     //interceptador proprio do axios para realizar a captura do token e encaminhar junto da requisição 
//     AXIOS.interceptors.request.use(
//         function (config) {
//             config.headers.Authorization = `Bearer ${token}` //-----
//             return config;
//         },
//         function (error) {

//             return Promise.reject(error);
//         }
//     );

//     AXIOS.interceptors.response.use(
//         function (response) {
//             return response;
//         },
//         function (error) {

//             if(error.status == 401) { 
//                 logout() 
//             } 

//             return Promise.reject(error);
//         }
//     );
//     return token ? children : <Navigate to="/" />
// }

// export default RotaProtegida;

import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AXIOS } from "../services";
import { AdminContext } from "../contexts/AdminProvaider";


const RotaProtegida = ({ children }) => {

    const { token, logout } = useContext(AdminContext);

    useEffect(() => {

        const interceptorRequest = AXIOS.interceptors.request.use(
            (config) => {

                // Busca sempre o token atualizado no Session Storage
                const tokenAtual = sessionStorage.getItem("token");

                if (tokenAtual) {
                    config.headers.Authorization = `Bearer ${tokenAtual}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        const interceptorResponse = AXIOS.interceptors.response.use(
            (response) => response,
            (error) => {

                if (error.response?.status === 401) {
                    logout();
                }

                return Promise.reject(error);
            }
        );

        // Remove os interceptadores quando o componente desmontar
        return () => {
            AXIOS.interceptors.request.eject(interceptorRequest);
            AXIOS.interceptors.response.eject(interceptorResponse);
        };

    }, [logout]);

    return token ? children : <Navigate to="/" />;
};

export default RotaProtegida;