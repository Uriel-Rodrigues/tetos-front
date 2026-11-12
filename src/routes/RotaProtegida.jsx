import { Navigate, useNavigate } from "react-router";
import { AXIOS } from "../services";

const RotaProtegida = ({ children }) => {

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate()

    //interceptador proprio do axios para realizar a captura do token e encaminhar junto da requisição 
    AXIOS.interceptors.request.use(
        function (config) {
            config.headers.Authorization = `Bearer ${token}`
            return config;
        },
        function (error) {


            return Promise.reject(error);
        }
    );

    // Add a response interceptor
    AXIOS.interceptors.response.use(
        function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response;
        },
        function (error) {

            if(error.status == 401){
                navigate("/")
            }
            return Promise.reject(error);
        }
    );
    return token ? children : <Navigate to="/" />
}

export default RotaProtegida;