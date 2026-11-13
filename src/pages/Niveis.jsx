import { Button, Table } from "antd";
import { LuPlus } from "react-icons/lu";
import { useBuscarNiveis } from "../hooks/niveisHooks";

const Niveis = () => {

    const {data: niveis} = useBuscarNiveis();

    return ( 
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">NIVEIS</h1>
                <Button 
                    type="primary"
                    icon={<LuPlus/>}
    
                > Novo nivel </Button>
            </div>
            <div>
                <Table
                    dataSource={niveis || []}
                >
                    <Table.Column
                        title="Nome"
                        dataIndex="nome"
                    />
                </Table>
            </div>
        </div>
     );
}
 
export default Niveis;