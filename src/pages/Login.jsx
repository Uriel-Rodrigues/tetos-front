import { App, Button, Form, Input, message } from "antd";
import { useLogin } from "../hooks/usuarioHooks";
import { useNavigate } from "react-router";

const Login = () => {

    const navigate = useNavigate();
    //usamos biblioteca cant design para umport
    const {notification} = App.useApp()

    const {mutate: login, isPending: loginPanding} = useLogin();

    function logar (dados) {
        login(dados, {
            onSuccess: ({type, description, usuario, token}) => {
                
                notification[type] ({
                    description: description
                });

                if (type == "success") {
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("usuario", JSON.stringify(usuario)) //usuario vem como objetos precisamos converter para texto
                    navigate("/painel")
                }
            }, 
            onError: ({response: {data : {type, description} } } ) => {
                notification[type] ({
                    description: description
                })
            }
        })
        
    }

    return ( 
        <div className="h-screen flex justify-center items-center bg-blue-500">
            <div className="w-75 p-4 bg-white rounded-2xl"> 
                <Form
                    layout="vertical"
                    onFinish={logar}
                >
                    <Form.Item
                        label="email"
                        name={"email"}
                        rules={[{required:true, message:"campo obrigatorio"}]}
                    >
                        <Input placeholder="email@email.com" />
                    </Form.Item>

                    <Form.Item
                        label="senha"
                        name={"senha"}
                        rules={[{required:true, message:"campo obrigatorio"}]}
                    >
                        <Input.Password placeholder="***********" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" className="w-full mt-4" loading={loginPanding}>Enviar</Button>
                </Form>
            </div>
        </div>
     );
}
 
export default Login;