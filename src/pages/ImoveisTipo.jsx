import { App, Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarImoveisTipo, useCriarImoveisTipo, useDeletarImoveisTipo, useEditarImoveisTipo } from "../hooks/imoveisTipoHooks";
import { useState } from "react";
import { QUERYCLIENT } from "../services";

const ImoveisTipo = () => {

    const  [mostrarCriar, setMostrarCriar] = useState(false)
    const [mostrarEditar, setMostrarEditar] = useState(false)
    const [dadosEditar, setDadosEditar] = useState([])
    //gleidson
    const [formEditar] = Form.useForm()

    const {data: tipos, isLoading: loadingImoveisTipo} = useBuscarImoveisTipo();
    const {notification} = App.useApp()
    const {mutate: criarImoveisTipo, isLoading: loadingCriar} = useCriarImoveisTipo()
    const {mutate: deletarImoveisTipo, isLoading: loadingDeletar} = useDeletarImoveisTipo()
    const {mutate: editarImoveisTipo, isLoading: loadingEditar} = useEditarImoveisTipo()

    //função que vai coletar os dados encaminhados pelo formulario e mandar para o hook criarImoveisTipo
    function criar (dados) {
        criarImoveisTipo(dados, {
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
        deletarImoveisTipo (id, {
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
        editarImoveisTipo(dados, ({
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
                <h1 className="text-3xl font-bold">Tipos de imovel</h1>
                <Button 
                    type="primary"
                    icon={<LuPlus/>}
                    onClick={() => setMostrarCriar(true)}
    
                > Novo Tipo </Button>
            </div>

            <div>
                <Table
                    dataSource={tipos || []}
                    rowKey={"id"} //roeKey funciona como chave unica de cada registro para percorrer o "array de objetos"
                    loading = {loadingImoveisTipo}
                >
                    <Table.Column
                        title="Nome"
                        dataIndex="nome"
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

            {/* componente antd para criar gaveta lateral de criar ImoveisTipo */}
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

            {/* componente antd para criar gaveta lateral de editar um ImoveisTipo */}
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
                        <Input placeholder="Nome do ImoveisTipo"/>
                    
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
 
export default ImoveisTipo;