import { App, Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarNivel, useCriarNivel } from "../hooks/niveisHooks";
import { useState } from "react";

const Niveis = () => {

    const  [mostrarCriar, setMostrarCriar] = useState(false)

    const {data: niveis, isLoading: loadingNiveis} = useBuscarNivel();
    const {notification} = App.useApp()
    const {mutate: criarNivel, isLoading: loadingCriar} = useCriarNivel()

    //função que vai coletar os dados encaminhados pelo formulario e mandar para o hook criarNiveis
    function criar (dados) {
        criarNivel(dados, {
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

    return ( 
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">NIVEIS</h1>
                <Button 
                    type="primary"
                    icon={<LuPlus/>}
                    onClick={() => setMostrarCriar(true)}
    
                > Novo nivel </Button>
            </div>

            <div>
                <Table
                    dataSource={niveis || []}
                    rowKey={"id"} //roeKey funciona como chave unica de cada registro para percorrer o "array de objetos"
                    loading = {loadingNiveis}
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

                                />
                                <Popconfirm
                                    title="Aviso"
                                    description="Deseja realmenta deletar este registro? esta ação não podera ser desfeita."
                                    okText="Sim"
                                    cancelText="Não"
                                >
                                    <Button
                                    icon={<LuTrash2 />}
                                    type="primary"

                                />

                                </Popconfirm>
                            </div>
                        )}
                    />
                </Table>
            </div>

            {/* componente antd para criar gaveta lateral */}
            <Drawer
                title="Criar"
                open={mostrarCriar}
                onClose={() => setMostrarCriar(false)}
            >
                <Form
                    layout="vertial"
                    onFinish={criar}
                >
                    <Form.Item 
                        label="Nome"
                        name="nome"
                    rules={[{required:true, message: "compo obrigatorio"}]}
                    >

                        <Input placeholder="nomde do nivel"/>
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
        </div>
     );
}
 
export default Niveis;