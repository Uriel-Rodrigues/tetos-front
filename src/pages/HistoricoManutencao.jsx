import { App, Button, Drawer, Form, Input, Popconfirm, Select, Table } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarHistoricoManutencao, useCriarHistoricoManutencao, useDeletarHistoricoManutencao, useEditarHistoricoManutencao } from "../hooks/historicoManutencaoHooks";
import {useBuscarImovel} from "../hooks/imoveisHooks"
import { useState } from "react";
import { QUERYCLIENT } from "../services";

const HistoricoManutencao = () => {

    const  [mostrarCriar, setMostrarCriar] = useState(false)
    const [mostrarEditar, setMostrarEditar] = useState(false)
    const [dadosEditar, setDadosEditar] = useState([])
    //gleidson
    const [formEditar] = Form.useForm()

    const {data: imoveis = [], isLoading: loadingImoveis} = useBuscarImovel();
    const {data: historico, isLoading: loadingHistoricoManutencao} = useBuscarHistoricoManutencao();
    const {notification} = App.useApp()
    const {mutate: criarHistoricoManutencao, isLoading: loadingCriar} = useCriarHistoricoManutencao()
    const {mutate: deletarHistoricoManutencao, isLoading: loadingDeletar} = useDeletarHistoricoManutencao()
    const {mutate: editarHistoricoManutencao, isLoading: loadingEditar} = useEditarHistoricoManutencao()

    //função que vai coletar os dados encaminhados pelo formulario e mandar para o hook criarHistoricoManutencao
    function criar (dados) {
        criarHistoricoManutencao(dados, {
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
        deletarHistoricoManutencao (id, {
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
        editarHistoricoManutencao(dados, ({
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
                <h1 className="text-3xl font-bold">Historico de Manutenção</h1>
                <Button 
                    type="primary"
                    icon={<LuPlus/>}
                    onClick={() => setMostrarCriar(true)}
    
                >Novo Historico de Manutenção </Button>
            </div>

            <div>
                <Table
                    dataSource={historico || []}
                    rowKey={"id"} //roeKey funciona como chave unica de cada registro para percorrer o "array de objetos"
                    loading = {loadingHistoricoManutencao}
                >
                    <Table.Column
                        title="Descrição"
                        dataIndex="descricao"
                    />
                    <Table.Column
                        title="Valor"
                        dataIndex="valor"
                    />
                    <Table.Column
                        title="Data"
                        dataIndex="data"
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

            {/* componente antd para criar gaveta lateral de criar HistoricoManutencao */}
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

                        <Input placeholder="descrição da manutenção"/>
                    </Form.Item>

                    <Form.Item 
                        label="Valor"
                        name="valor"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="valor da manutenção"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Data"
                        name="data"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="AAAA-MM-DD"/>
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

            {/* componente antd para criar gaveta lateral de editar um HistoricoManutencao */}
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

                        <Input placeholder="descrição da manutenção"/>
                    </Form.Item>

                    <Form.Item 
                        label="Valor"
                        name="valor"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="valor da manutenção"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Data"
                        name="data"
                        rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="AAAA-MM-DD"/>
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
 
export default HistoricoManutencao;