import { App, Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarLocatario, useCriarLocatario, useDeletarLocatario, useEditarLocatario } from "../hooks/locatariosHooks";
import { useState } from "react";

const Locatarios = () => {

    const  [mostrarCriar, setMostrarCriar] = useState(false)
    const [mostrarEditar, setMostrarEditar] = useState(false)
    // const [dadosEditar, setDadosEditar] = useState([])
    //gleidson
    const [formCriar] = Form.useForm()
    const [formEditar] = Form.useForm()


    const {data: locatarios, isLoading: loadingLocatarios} = useBuscarLocatario();
    const {notification} = App.useApp()
    const {mutate: criarLocatario, isLoading: loadingCriar} = useCriarLocatario()
    const {mutate: deletarLocatario, isLoading: loadingDeletar} = useDeletarLocatario()
    const {mutate: editarLocatario, isLoading: loadingEditar} = useEditarLocatario()

    //função que vai coletar os dados encaminhados pelo formulario e mandar para o hook criarLocatarios
    function criar (dados) {
        criarLocatario(dados, {
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
        deletarLocatario (id, {
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
        editarLocatario(dados, ({
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
                <h1 className="text-3xl font-bold">Locatarios</h1>
                <Button 
                    type="primary"
                    icon={<LuPlus/>}
                    onClick={() => setMostrarCriar(true)}
    
                > Novo Locatario </Button>
            </div>

            <div>
                <Table
                    dataSource={locatarios || []}
                    rowKey={"id"} //roeKey funciona como chave unica de cada registro para percorrer o "array de objetos"
                    loading = {loadingLocatarios}
                >
                    <Table.Column
                        title="Nome"
                        dataIndex="nome"
                    />
                    <Table.Column
                        title="Telefone"
                        dataIndex="telefone"
                    />
                    <Table.Column
                        title="CPF/CNPJ"
                        dataIndex="cpf_cnpj"
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

            {/* componente antd para criar gaveta lateral de criar Locatario */}
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

                        <Input placeholder="nome do Locatario"/>
                    </Form.Item>

                    <Form.Item 
                        label="Telefone"
                        name="telefone"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="teleforne do Locatario"/>
                    </Form.Item>

                    <Form.Item 
                        label="cpf ou cnpj"
                        name="cpf_cnpj"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="cpf ou cnpj"/>
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

            {/* componente antd para criar gaveta lateral de editar um Locatario */}
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
                        <Input placeholder="Nome do Locatario"/>
                    
                    </Form.Item>

                    <Form.Item 
                        label="Telefone"
                        name="telefone"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="teleforne do Locatario"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="cpf ou cnpj"
                        name="cpf_cnpj"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="cpf ou cnpj"/>
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
 
export default Locatarios;