import { App, Button, Drawer, Form, Image, Input, Popconfirm, Select, Table, Upload } from "antd";
import { LuImageOff, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarImovel, useCriarImovel, useDeletarImovel, useEditarImovel } from "../hooks/imoveisHooks";
import {useBuscarImoveisTipo} from "../hooks/imoveisTipoHooks"
import {useBuscarLocatario} from "../hooks/locatariosHooks"
import { useEffect, useState } from "react";
import { APIURL, QUERYCLIENT } from "../services";
import { BiPlus } from "react-icons/bi";
import { useLocation } from "react-router";

const Imoveis = () => {

    const location = useLocation()

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
        const formData = new FormData();

        // Percorre os campos do formulário
        Object.entries(dados).forEach(([chave, valor]) => {
            if (chave !== "imagem" && valor !== undefined && valor !== null) {
                formData.append(chave, valor);
            }
        });

        // Recupera o arquivo selecionado no Upload
        const arquivo = dados.imagem?.[0]?.originFileObj;

        if (arquivo) {
            formData.append("imagem", arquivo);
        }

        for (const [chave, valor] of formData.entries()) {
        console.log(chave, valor);
        }

        criarImovel(formData, {
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
        const formData = new FormData();

        // Percorre os campos do imóvel
        Object.entries(dados).forEach(([chave, valor]) => {

            if (chave === "imagem") {

                // Recupera o arquivo original, caso uma nova imagem tenha sido selecionada
                const arquivo = valor?.[0]?.originFileObj;

                if (arquivo) {
                    formData.append("imagem", arquivo);
                }

                } else if (valor !== undefined && valor !== null) {

                    formData.append(chave, valor);

                }

            });
        editarImovel({id:dados.id, formData}, ({
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

    useEffect(() => {
        if(location.state?.abrirCadastroImovel){
            setMostrarCriar(true)
        }
    },[])

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
                                        // formEditar.setFieldValue("id", linha.id)
                                        // formEditar.setFieldValue("nome",linha.nome)
                                        // filds preenche todos os campos
                                        formEditar.setFieldsValue({
                                            ...linha,
                                            imagem: linha.imagem? [{uid:"-1",name: "imagem.jpg", status: "done", url:`${APIURL}${linha.imagem}`}]: []})
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
                        label="Matricula"
                        name="matricula"
                    >
                        <Input placeholder="matricula do imovel"/>
                    </Form.Item>

                    <Form.Item 
                        label="Bairro"
                        name="bairro"
                        rules={[{required:true, message:"campo obrigatorio"}]}
                    >
                        <Input placeholder="Bairro do imovel"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Cidade"
                        name="cidade"
                        rules={[{required:true, message:"campo obrigatorio"}]}
                    >
                        <Input placeholder="cidade do imovel"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Estado"
                        name="estado"
                        rules={[{required:true, message:"campo obrigatorio"}]}
                    >
                        <Input placeholder="sigla do estado do imovel"/>
                    </Form.Item>

                    <Form.Item 
                        label="Numero"
                        name="numero"
                        rules={[{required:true, message:"campo obrigatorio"}]}
                    >
                        <Input placeholder="numero do imovel"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Complemento"
                        name="complemento"
                    >
                        <Input placeholder="complemento"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Cep"
                        name="cep"
                        rules={[{required: true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="Cep"/>
                    </Form.Item>

                    <Form.Item 
                        label="Valor do Aluguel"
                        name="valor_aluguel"
                        rules={[{required: true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="Valor do Aluguel"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="iptu"
                        name="iptu"
                    >
                        <Input placeholder="iptu"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Valor do Condominio"
                        name="valor_condominio"
                        
                    >
                        <Input placeholder="Valor do Condominio"/>
                    </Form.Item>

                    <Form.Item 
                        label="Metragem"
                        name="metragem"
                        rules={[{required: true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="Metragem do Condominio"/>
                    </Form.Item>

                    <Form.Item 
                        label="Quartos"
                        name="quartos"
                        rules={[{required: true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="numero de quartos"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Suites"
                        name="suites"
                        rules={[{required: true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="numero de suites"/>
                    </Form.Item>

                    <Form.Item 
                        label="Banheiros"
                        name="banheiros"
                        rules={[{required: true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="numero de banheiros"/>
                    </Form.Item>

                    <Form.Item 
                        label="Garagens"
                        name="garagens"
                    >
                        <Input placeholder="numero de garagens"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Logradouro"
                        name="logradouro"
                        rules={[{required: true, message:"compo obrigatorio"}]}
                    >
                        <Input placeholder="logradouro do imovel"/>
                    </Form.Item>

                    <Form.Item 
                        label="tipo de movel"
                        name="tipo_id"
                        rules={[{required: true, message:"compo obrigatorio"}]}
                    >
                        <Select
                            placeholder= "escolha um tipo de imovel"
                            options={(tipos || []).map(tipo => {
                                return {
                                    label: tipo.nome,
                                    value: tipo.id
                                }
                            })}
                        />
                    </Form.Item>

                    <Form.Item 
                        label="Locatario"
                        name="locatario_id"
                    >
                        <Select
                            placeholder= "escolha um tipo de imovel"
                            options={(locatarios || []).map(locatario => {
                                return {
                                    label: locatario.nome,
                                    value: locatario.id
                                }
                            })}
                        />
                    </Form.Item>
                    
                    <Form.Item 
                        label="Imagem do imovel"
                        name="imagem"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList || []}
                    >
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={() => false}
                            accept="image/"
                        >
                            <button
                                type="button"
                                style={{border: 0, background: 'none'}}
                            >
                                <BiPlus />
                                <div style={{marginTop:8}}>enviar imagm</div>
                                
                            </button>

                        </Upload>
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
                        label="Matricula"
                        name="matricula"
                    >
                        <Input placeholder="matricula do imovel"/>
                    </Form.Item>

                    <Form.Item 
                        label="Bairro"
                        name="bairro"
                        rules={[{required:true, message:"campo obrigatorio"}]}
                    >
                        <Input placeholder="Bairro do imovel"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Cidade"
                        name="cidade"
                        rules={[{required:true, message:"campo obrigatorio"}]}
                    >
                        <Input placeholder="cidade do imovel"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Estado"
                        name="estado"
                        rules={[{required:true, message:"campo obrigatorio"}]}
                    >
                        <Input placeholder="sigla do estado do imovel"/>
                    </Form.Item>

                    <Form.Item 
                        label="Numero"
                        name="numero"
                        rules={[{required:true, message:"campo obrigatorio"}]}
                    >
                        <Input placeholder="numero do imovel"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Complemento"
                        name="complemento"
                    >
                        <Input placeholder="complemento"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Cep"
                        name="cep"
                        rules={[{required: true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="Cep"/>
                    </Form.Item>

                    <Form.Item 
                        label="Valor do Aluguel"
                        name="valor_aluguel"
                        rules={[{required: true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="Valor do Aluguel"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="iptu"
                        name="iptu"
                    >
                        <Input placeholder="iptu"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Valor do Condominio"
                        name="valor_condominio"
                        
                    >
                        <Input placeholder="Valor do Condominio"/>
                    </Form.Item>

                    <Form.Item 
                        label="Metragem"
                        name="metragem"
                        rules={[{required: true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="Metragem do Condominio"/>
                    </Form.Item>

                    <Form.Item 
                        label="Quartos"
                        name="quartos"
                        rules={[{required: true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="numero de quartos"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Suites"
                        name="suites"
                        rules={[{required: true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="numero de suites"/>
                    </Form.Item>

                    <Form.Item 
                        label="Banheiros"
                        name="banheiros"
                        rules={[{required: true, message: "compo obrigatorio"}]}
                    >
                        <Input placeholder="numero de banheiros"/>
                    </Form.Item>

                    <Form.Item 
                        label="Garagens"
                        name="garagens"
                    >
                        <Input placeholder="numero de garagens"/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Logradouro"
                        name="logradouro"
                        rules={[{required: true, message:"compo obrigatorio"}]}
                    >
                        <Input placeholder="logradouro do imovel"/>
                    </Form.Item>

                    <Form.Item 
                        label="tipo de movel"
                        name="tipo_id"
                        rules={[{required: true, message:"compo obrigatorio"}]}
                    >
                        <Select
                            placeholder= "escolha um tipo de imovel"
                            options={(tipos || []).map(tipo => {
                                return {
                                    label: tipo.nome,
                                    value: tipo.id
                                }
                            })}
                        />
                    </Form.Item>

                    <Form.Item 
                        label="Locatario"
                        name="locatario_id"
                    >
                        <Select
                            placeholder= "escolha um tipo de imovel"
                            options={(locatarios || []).map(locatario => {
                                return {
                                    label: locatario.nome,
                                    value: locatario.id
                                }
                            })}
                        />
                    </Form.Item>
                    
                    <Form.Item 
                        label="Imagem do imovel"
                        name="imagem"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList || []}
                    >
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={() => false}
                            accept="image/*"
                        >
                            <button
                                type="button"
                                style={{border: 0, background: 'none'}}
                            >
                                <BiPlus />
                                <div style={{marginTop:8}}>enviar imagm</div>
                                
                            </button>

                        </Upload>
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