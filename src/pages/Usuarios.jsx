import { App, Button, Drawer, Form, Input, Popconfirm, Select, Table } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarUsuario, useCriarUsuario, useDeletarUsuario, useEditarUsuario } from "../hooks/usuarioHooks";

import { useState } from "react";
import { useBuscarNivel } from "../hooks/niveisHooks";
import Password from "antd/es/input/Password";

const Usuarios = () => {

    const  [mostrarCriar, setMostrarCriar] = useState(false)
    const [mostrarEditar, setMostrarEditar] = useState(false)
    // const [dadosEditar, setDadosEditar] = useState([])
    //gleidson
    const [formCriar] = Form.useForm()
    const [formEditar] = Form.useForm()


    const {data: usuarios, isLoading: loadingUsuarios} = useBuscarUsuario();
    //nivels = [] auqui estamos fazendo com que ele ja comece com um array vazio quando chagar as informações sera preenchido
    const {data: niveis = [], isLoading: loadingNivels} = useBuscarNivel();
    
    const {notification} = App.useApp()
    const {mutate: criarUsuario, isLoading: loadingCriar} = useCriarUsuario()
    const {mutate: deletarUsuario, isLoading: loadingDeletar} = useDeletarUsuario()
    const {mutate: editarUsuario, isLoading: loadingEditar} = useEditarUsuario()

    //função que vai coletar os dados encaminhados pelo formulario e mandar para o hook criarUsuarios
    function criar (dados) {
        criarUsuario(dados, {
            onSuccess: ({type, description}) => {
                setMostrarCriar(false); //fecha a gaveta se tudo der certo
                formCriar.resetFields()
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
        deletarUsuario (id, {
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
        editarUsuario(dados, ({
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
                <h1 className="text-3xl font-bold">Usuários</h1>
                <Button 
                    type="primary"
                    icon={<LuPlus/>}
                    onClick={() => setMostrarCriar(true)}
    
                > Novo Usuário </Button>
            </div>

            <div>
                <Table
                    dataSource={usuarios || []}
                    rowKey={"id"} //roeKey funciona como chave unica de cada registro para percorrer o "array de objetos"
                    loading = {loadingUsuarios}
                >
                    <Table.Column
                        title="Nome"
                        dataIndex="nome"
                    />
                    <Table.Column
                        title="Email"
                        dataIndex="email"
                    />
                    <Table.Column
                        title="Nivel"
                        // estamos trasendo o relacionamento 
                        dataIndex={["nivel","nome"]}
                        // render={(_, linha) => linha.nivel.nome}
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
                                        //formEditar.setFieldValue("id", linha.id)
                                        //formEditar.setFieldValue("nome",linha.nome)
                                        // filds preenche todos os campos
                                        formEditar.setFieldsValue(linha)
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

            {/* componente antd para criar gaveta lateral de criar Usuario */}
            <Drawer
                title="Criar"
                open={mostrarCriar}
                onClose={() => setMostrarCriar(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={criar}
                    form={formCriar}
                >
                    <Form.Item 
                        label="Nome"
                        name="nome"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="nome do Usuario"/>
                    </Form.Item>

                    <Form.Item 
                        label="Email"
                        name="email"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="email@email.com"/>
                    </Form.Item>

                    <Form.Item 
                        label="Senha"
                        name="senha"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input.Password placeholder="************"/>
                    </Form.Item>

                    <Form.Item 
                        label="Nivel "
                        name="nivel_id"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Select 
                            placeholder="escolha um nivel"
                            options={(niveis || []).map(nivel => {
                                return {
                                    label: nivel.nome,
                                    value: nivel.id
                                }
                            })}
                        />
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

            {/* componente antd para criar gaveta lateral de editar um Usuario */}
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
                        <Input placeholder="Nome do Usuario"/>
                    
                    </Form.Item>

                    <Form.Item 
                        label="Email"
                        name="email"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="email do usuario"/>
                    </Form.Item>

                    <Form.Item 
                        label="Senha"
                        name="senha"
                    >

                        <Input.Password placeholder="************"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Nivel "
                        name="nivel_id"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Select 
                            placeholder="escolha um nivel"
                            options={(niveis || []).map(nivel => {
                                return {
                                    label: nivel.nome,
                                    value: nivel.id
                                }
                            })}
                        />
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
 
export default Usuarios;