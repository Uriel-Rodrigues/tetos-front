import { BiBuildings, BiHome, BiSolidUser, BiWrench } from "react-icons/bi";
import {useBuscarUsuario} from "../hooks/usuarioHooks"
import {useBuscarLocatario} from "../hooks/locatariosHooks"
import {useBuscarImovel} from "../hooks/imoveisHooks"
import {useBuscarHistoricoManutencao} from "../hooks/historicoManutencaoHooks"
import { Button, Card, Flex, Statistic } from "antd";
import { AiOutlineSolution, AiOutlineTeam, AiOutlineUser, AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BsBuildingAdd } from "react-icons/bs";

const Home = () => {
    const navigate = useNavigate()

    const [usuario, setUsuario] = useState("")

    const {data: historico, isLoading: loadingHistorico} = useBuscarHistoricoManutencao();
    const totalHistoricos= historico?.length ?? 0
    
    const {data: imoveis, isLoading: loadingImoveis} = useBuscarImovel();
    const totalImoveis= imoveis?.length ?? 0
    
    const {data: locatarios, isLoading: loadingLocatarios} = useBuscarLocatario();
    const totalLocatarios= locatarios?.length ?? 0
    
    const {data: usuarios, isLoading: loadingUsuarios} = useBuscarUsuario();
    const totalUsuarios= usuarios?.length ?? 0
    

    useEffect(() => {
        setUsuario(JSON.parse(sessionStorage.getItem("usuario")))

    }, [])


    return ( 
        <section>
            <div className=" flex gap-4 mb-5">
                <div className="flex items-center gap-3 mb-2">
                    <BiHome className="h-full w-10 fill-blue-500" />
                    <h1 className="font-bold text-3xl text-blue-500">Home</h1>
                </div>
                <div>
                    <h1 className="font-bold text-3xl text-blue-500">-</h1>
                </div>
                <div className="font text-3xl text-blue-700">
                    <h1>Seja bem Vindo(a) <span className="text-3xl text-blue-700">
                        {`${usuario.nome?.charAt(0).toUpperCase()+ usuario.nome?.slice(1) } !`}
                        </span></h1>
                </div>
            </div>

            <div>
                <h1 className="text-xl text-blue-500 mb-2">Por onde gostaria de começar? </h1>
                <div className="flex justify-around mb-10">
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate("/painel/usuarios", {state: {abrirCadastro: true}})}
                        icon={<AiOutlineUserAdd className="h-full w-6"/> }
                    >
                        Cadastrar novo usuario
                    </Button>

                    <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate("/painel/imoveis", {state: {abrirCadastroImovel: true}})}
                        icon={<BsBuildingAdd className="h-full w-6"/> }
                    >
                        Cadastrar novo Imovel
                    </Button>

                    <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate("/painel/locatarios", {state: {abrirCadastroLocatario: true}})}
                        icon={<AiOutlineUsergroupAdd className="h-full w-6"/> }
                    >
                        Cadastrar novo Locatario
                    </Button>
                </div>

            </div>

            <div className="flex flex-col gap-3" >
                <Card>
                    <Flex align="center" gap={16}>
                        <AiOutlineUser className="h-full w-10 fill-blue-500"/>
                        <Statistic
                            title="Usuários"
                            value={totalUsuarios}
                            // prefix={<UserOutlined />}
                            loading={loadingUsuarios}
                        />
                    </Flex>
                </Card>

                <Card>
                    <Flex align="center" gap={16}>
                        <AiOutlineSolution  className="h-full w-10 fill-blue-500" />
                        <Statistic
                            title="Locatarios"
                            value={totalLocatarios}
                            // prefix={<UserOutlined />}
                            loading={loadingUsuarios}
                        />
                    </Flex>
                </Card>

                <Card>
                    <Flex align="center" gap={16}>
                        <BiBuildings  className="h-full w-10 fill-blue-500" />
                        <Statistic
                            title="Imoveis"
                            value={totalImoveis}
                            // prefix={<UserOutlined />}
                            loading={loadingImoveis}
                        />
                    </Flex>
                </Card>

                <Card>
                    <Flex align="center" gap={16}>
                        <BiWrench  className="h-full w-10 fill-blue-500" />
                        <Statistic
                            title="historico de manutenções"
                            value={totalHistoricos}
                            // prefix={<UserOutlined />}
                            loading={loadingHistorico}
                        />
                    </Flex>
                </Card>
            </div>

        </section>
        
     );
}
 
export default Home;