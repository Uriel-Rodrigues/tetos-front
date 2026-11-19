import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Login from "../pages/login";
import Home from "../pages/Home";
import RotaProtegida from "./RotaProtegida";
import Niveis from "../pages/Niveis";
import Locatarios from "../pages/Locatarios"
import PageLayout from "../layouts/PageLayout";
import { useContext } from "react";
import { AdminContext } from "../contexts/AdminProvaider";
import ImoveisTipo from "../pages/ImoveisTipo";
import Usuarios from "../pages/Usuarios";

const Rotas = () => {
    const {token} = useContext(AdminContext) //pegando o contexto do admin provider
    return ( 
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                {
                    token && (
                        <Route path="painel" element={<RotaProtegida> <PageLayout/> </RotaProtegida>}>
                            <Route index element={<Home />} />
                            <Route path="niveis" element= {<Niveis />} />
                            <Route path="imoveis-tipo" element= {<ImoveisTipo />} />
                            <Route path="locatarios" element= {<Locatarios />} />
                            <Route path="usuarios" element= {<Usuarios />} />
                        </Route>

                    )
                }
                <Route path="*" element={<VoltarPraLogin/>} />
            </Routes>
        </BrowserRouter>
     );
}

// componente que vai fazer voltar para tela de login caso alguem tente acessar a rota sem token 
const VoltarPraLogin = () => {
    return <Navigate to ="/"/>
}

export default Rotas;