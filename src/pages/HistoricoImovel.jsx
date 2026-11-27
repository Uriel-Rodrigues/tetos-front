import { App, Button, Drawer, Form, Input, Popconfirm, Select, Table } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarHistoricoImovel, useCriarHistoricoImovel, useDeletarHistoricoImovel, useEditarHistoricoImovel } from "../hooks/historicoImovelHooks";
import {useBuscarImovel} from "../hooks/imoveisHooks"
import {useBuscarLocatario} from "../hooks/locatariosHooks"
import { useState } from "react";
import { QUERYCLIENT } from "../services";

const HistoricoImovel = () => {

    const  [mostrarCriar, setMostrarCriar] = useState(false)
    const [mostrarEditar, setMostrarEditar] = useState(false)
    const [dadosEditar, setDadosEditar] = useState([])
    //gleidson
    const [formEditar] = Form.useForm()

    const {data: imoveis = [], isLoading: loadingImoveis} = useBuscarImovel();
    const {data: locatarios = [], isLoading: loadingLocatarios} = useBuscarLocatario();
    
    const {data: historico, isLoading: loadingHistoricoImovel} = useBuscarHistoricoImovel();    
    const {notification} = App.useApp()
    const {mutate: criarHistoricoImovel, isLoading: loadingCriar} = useCriarHistoricoImovel()
    const {mutate: deletarHistoricoImovel, isLoading: loadingDeletar} = useDeletarHistoricoImovel()
    const {mutate: editarHistoricoImovel, isLoading: loadingEditar} = useEditarHistoricoImovel()

    //função que vai coletar os dados encaminhados pelo formulario e mandar para o hook criarHistoricoImovel
    function criar (dados) {
        criarHistoricoImovel(dados, {
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
        deletarHistoricoImovel (id, {
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
        editarHistoricoImovel(dados, ({
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
                <h1 className="text-3xl font-bold">Hitorico de Imoveis</h1>
                <Button 
                    type="primary"
                    icon={<LuPlus/>}
                    onClick={() => setMostrarCriar(true)}
    
                > Novo Hitorico de Imovel </Button>
            </div>

            <div>
                <Table
                    dataSource={historico || []}
                    rowKey={"id"} //roeKey funciona como chave unica de cada registro para percorrer o "array de objetos"
                    loading = {loadingHistoricoImovel}
                >
                    <Table.Column
                        title="Descriçao"
                        dataIndex="descricao"
                    />
                    <Table.Column
                        title="Data de Entrada"
                        dataIndex="data_entrada"
                    />
                    <Table.Column
                        title="Data de Saida"
                        dataIndex="data_saida"
                    />
                    <Table.Column
                        title="Valor do Aluguel"
                        dataIndex="valor_aluguel"
                    />
                    <Table.Column
                        title="Valor do iptu"
                        dataIndex="valor_iptu"
                    />
                    <Table.Column
                        title="Valor do Condominio"
                        dataIndex="valor_condominio"
                    />
                    <Table.Column
                        title="Valor do iptu"
                        dataIndex="valor_iptu"
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
                                        // formEditar.setFieldValue("id", linha.id)
                                        // formEditar.setFieldValue("nome",linha.nome)
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

            {/* componente antd para criar gaveta lateral de criar HistoricoImovel */}
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
                        label="Descrição"
                        name="descricao"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="descrição do imovel"/>
                    </Form.Item>

                    <Form.Item 
                        label="Data Entrada"
                        name="data_entrada"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="AAAA-MM-DD"/>
                    </Form.Item>

                    <Form.Item 
                        label="Data de Saida"
                        name="data_saida"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="AAAA-MM-DD"/>
                    </Form.Item>

                    <Form.Item 
                        label="Valor do aluguel"
                        name="valor_aluguel"
                    >

                        <Input placeholder="valor do aluguel"/>
                    </Form.Item>

                    <Form.Item 
                        label="Valor do iptu"
                        name="valor_iptu"
                    >

                        <Input placeholder="valor do iptu"/>
                    </Form.Item>

                    <Form.Item 
                        label="Valor do Condominio"
                        name="valor_condominio"
                    >

                        <Input placeholder="valor do condominio"/>
                    </Form.Item>

                    <Form.Item 
                        label="imovel "
                        name="imovel_id"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Select 
                            placeholder="escolha um imovel"
                            options={(imoveis || []).map(imovel => {
                                return {
                                    label: imovel.matricula,
                                    value: imovel.id
                                }
                            })}
                        />
                    </Form.Item>

                    <Form.Item 
                        label="Locatarios "
                        name="locatario_id"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Select 
                            placeholder="escolha um locatario"
                            options={(locatarios || []).map(locatario => {
                                return {
                                    label: locatario.nome,
                                    value: locatario.id
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

            {/* componente antd para criar gaveta lateral de editar um HistoricoImovel */}
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
                        label="Descrição"
                        name="descricao"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="descrição do imovel"/>
                    </Form.Item>

                    <Form.Item 
                        label="Data Entrada"
                        name="data_entrada"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="AAAA-MM-DD"/>
                    </Form.Item>

                    <Form.Item 
                        label="Data de Saida"
                        name="data_saida"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="AAAA-MM-DD"/>
                    </Form.Item>

                    <Form.Item 
                        label="Valor do aluguel"
                        name="valor_aluguel"
                    >

                        <Input placeholder="valor do aluguel"/>
                    </Form.Item>

                    <Form.Item 
                        label="Valor do iptu"
                        name="valor_iptu"
                    >

                        <Input placeholder="valor do iptu"/>
                    </Form.Item>

                    <Form.Item 
                        label="Valor do Condominio"
                        name="valor_condominio"
                    >

                        <Input placeholder="valor do condominio"/>
                    </Form.Item>

                    <Form.Item 
                        label="imovel "
                        name="imovel_id"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Select 
                            placeholder="escolha um imovel"
                            options={(imoveis || []).map(imovel => {
                                return {
                                    label: imovel.matricula,
                                    value: imovel.id
                                }
                            })}
                        />
                    </Form.Item>

                    <Form.Item 
                        label="Locatarios "
                        name="locatario_id"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Select 
                            placeholder="escolha um locatario"
                            options={(locatarios || []).map(locatario => {
                                return {
                                    label: locatario.nome,
                                    value: locatario.id
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
 
export default HistoricoImovel;