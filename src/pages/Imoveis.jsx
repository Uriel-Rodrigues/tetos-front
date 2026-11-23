import { App, Button, Drawer, Form, Image, Input, Popconfirm, Table } from "antd";
import { LuImageOff, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarImovel, useCriarImovel, useDeletarImovel, useEditarImovel } from "../hooks/imoveisHooks";
import {useBuscarImoveisTipo} from "../hooks/imoveisTipoHooks"
import {useBuscarLocatario} from "../hooks/locatariosHooks"
import { useState } from "react";
import { APIURL, QUERYCLIENT } from "../services";

const Imoveis = () => {

    const  [mostrarCriar, setMostrarCriar] = useState(false)
    const [mostrarEditar, setMostrarEditar] = useState(false)
    const [dadosEditar, setDadosEditar] = useState([])
    //gleidson
    const [formEditar] = Form.useForm()

    const {data: imoveis, isLoading: loadingImovel} = useBuscarImovel("?tipo=true&locatario=true");
    const {data: tipos} = useBuscarImoveisTipo();
    const {data: locatarios} = useBuscarLocatario();
    const {notification} = App.useApp()
    const {mutate: criarImovel, isLoading: loadingCriar} = useCriarImovel()
    const {mutate: deletarImovel, isLoading: loadingDeletar} = useDeletarImovel()
    const {mutate: editarImovel, isLoading: loadingEditar} = useEditarImovel()

    //função que vai coletar os dados encaminhados pelo formulario e mandar para o hook criarImovel
    function criar (dados) {
        criarImovel(dados, {
            onSuccess: ({type, description}) => {
                setMostrarCriar(false); //fecha a gaveta se tudo der certo
                notification[type]({
                    description,
                    placement: "bottomRight"
                })
            },
            onError: ({response: {data : {type, description} } } ) => {
                notification[type] ({
                    description: description
                })
            }
        })
    }

    
    function deletar(id) {
        deletarImovel (id, {
            onSuccess: ({type, description}) => {
                notification[type]({
                    description,
                    placement: "bottomRight"
                })
            },
            onError: ({response: {data : {type, description} } } ) => {
                notification[type] ({
                    description: description
                })
            }
        })

    }

    function editar (dados) {
        editarImovel(dados, ({
            onSuccess: ({type, description}) => {
                setMostrarEditar(false)
                notification[type] ({
                    description,
                    placement: "bottomRight"
                })
            },
            onError: ({response: {data : {type, description} } } ) => {
                notification[type] ({
                    description: description
                })
            }
        }))
        
    }

    // function editarButao (linha) {
    //     setMostrarEditar(true)
    //     setDadosEditar(linha)
    // }

    return ( 
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Imóveis</h1>
                <Button 
                    type="primary"
                    icon={<LuPlus/>}
                    onClick={() => setMostrarCriar(true)}
    
                > Novo Imóvel </Button>
            </div>

            <div>
                <Table
                    dataSource={imoveis || []}
                    rowKey={"id"} //roeKey funciona como chave unica de cada registro para percorrer o "array de objetos"
                    loading = {loadingImovel}
                >
                    <Table.Column
                        title="Foto"
                        render = {(_, linha) => {
                            return linha.imagem? (
                            <Image 
                                width={80}
                                height={60}
                                className="object-contain"
                                src={`${APIURL}${linha?.imagem}`} />
                        ) : (
                            <div className="w-20 h-10 bg-slate-300 flex justify-center items-center">
                                <LuImageOff />
                            </div>
                            )
                        }}
                    />

                    <Table.Column
                        title="Endereço"
                        render = {(_, linha) => (
                            `${linha.logradouro} ${linha.numero} ${linha?.complemento ? linha.complemento : ""}, ${linha.bairro}, ${linha.cidade}- ${linha.estado}`
                        )}
                    />

                    <Table.column 
                        title = " Quartos"
                        dataIndex = "quartos"
                        align="center"
                    />

                    <Table.column 
                        title = " Banheiros"
                        dataIndex = "banheiros"
                        align="center"
                    />

                    <Table.column 
                        title = " Garagens"
                        render = {(_, linha) => (linha.garagens ? linha.garagens : "---")}
                    />

                    <Table.column 
                        title = " Quartos"
                        dataIndex = "quartos"
                        align="center"
                    />

                    <Table.column 
                        title = "Tipo"
                        dataIndex = {["imoveis_tipo", "nome"]}
                        align="center"
                    />

                    <Table.column 
                        title = "Locatario"
                        render = {(_, linha) => (linha.locatario ? linha.locatario.nome : "Disponivel")}
                    />

                    <Table.Column
                        title="Ações"
                        className="w-25"
                        render={(_, linha) => (
                            <div className="w-25 flex gap-2">
                                <Button
                                    icon={<LuPencil />}
                                    type="primary"
                                    // onClick = {() => editarButao(linha) }
                                    onClick={() => {
                                        formEditar.setFieldValue("id", linha.id)
                                        formEditar.setFieldValue("nome",linha.nome)
                                        // filds preenche todos os campos
                                        // formEditar.setFieldsValue(linha)
                                        setMostrarEditar(true)
                                    }}
                                    

                                />
                                <Popconfirm
                                    title="Aviso"
                                    description="Deseja realmenta deletar este registro? esta ação não podera ser desfeita."
                                    okText="Sim"
                                    cancelText="Não"
                                    onConfirm={() => deletar(linha.id)}
                                >
                                    <Button
                                    icon={<LuTrash2 />}
                                    type="primary"
                                    loading = {loadingDeletar}
                                    
                                />

                                </Popconfirm>
                            </div>
                        )}
                    />
                </Table>
            </div>

            {/* componente antd para criar gaveta lateral de criar Imovel */}
            <Drawer
                title="Criar"
                open={mostrarCriar}
                onClose={() => setMostrarCriar(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={criar}
                >
                    <Form.Item 
                        label="Nome"
                        name="nome"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="nome do tipo do imovel"/>
                    </Form.Item>

                    <div className="flex justify-end">
                        <Button 
                            type="primary"
                            htmlType="submit"
                            loading={loadingCriar}
                        >
                            Enviar
                        </Button>
                    </div>
                </Form>
            </Drawer>

            {/* componente antd para criar gaveta lateral de editar um Imovel */}
            <Drawer 
                title= "Editar"
                open= {mostrarEditar}
                onClose={() => setMostrarEditar(false)}
            >
                <Form 
                    layout="vertical"
                    onFinish={editar}
                    form={formEditar}
                >
                    <Form.Item
                        name="id"
                        hidden
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item 
                        label= "Nome"
                        name="nome"
                        // initialValue={dadosEditar.nome}
                        
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="Nome do Imovel"/>
                    
                    </Form.Item>
                    
                    <div className="flex justify-end">
                        <Button 
                            type="primary"
                            htmlType="submit"
                            loading ={loadingEditar}
                        >
                         Editar   
                        </Button>
                    </div>

                </Form>

            </Drawer>


        </div>
     );
}
 
export default Imoveis;