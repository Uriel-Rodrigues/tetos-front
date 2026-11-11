import { Button, Form, Input, message } from "antd";
import { useLogin } from "../hooks/usuarioHooks";

const Login = () => {

    const {mutate: login, isPending: loginPanding} = useLogin();

    function logar (dados) {
        login(dados, {
            onSuccess: (res) => {
                alert (res.description)

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

                    <Button type="primary" htmlType="submit" className="w-full mt-4">Enviar</Button>
                </Form>
            </div>
        </div>
     );
}
 
export default Login;