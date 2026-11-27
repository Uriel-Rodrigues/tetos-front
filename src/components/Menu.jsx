import { NavLink } from "react-router";

const Menu = () => {
    return ( 
        <header className="w-55 h-screen bg-blue-500 p-4">
            <div className="mb-5">
                <img src="/tetos.png" alt="logo" className="h-full w-45" />
            </div>

            <nav className="flex flex-col *:leading-10 *:font-bold *:text-white! *:hover:bg-white/25! *:rounded *:duration-200 *:pl-4 *:[&.active]:bg-white! *:[&.active]:text-blue-500!">
                <NavLink end to="/painel">Home</NavLink>
                <NavLink end to="/painel/niveis">Niveis</NavLink>
                <NavLink end to="/painel/imoveis-tipo">Imóveis Tipo</NavLink>
                <NavLink end to="/painel/locatarios">Locatários</NavLink>
                <NavLink end to="/painel/usuarios">Usuários</NavLink>
                <NavLink end to="/painel/imoveis">Imóveis</NavLink>
                <NavLink end to="/painel/HistoricoManutencao">historico de manutenção</NavLink>
                <NavLink end to="/painel/HistoricoImovel">historico do imovel</NavLink>
            </nav>


        </header> 
    );
}
 
export default Menu;