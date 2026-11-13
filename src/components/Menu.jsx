import { NavLink } from "react-router";

const Menu = () => {
    return ( 
        <header className="w-55 h-screen bg-blue-500 p-4">
            <h1 className="text-4xl font-semibold text-white">TETOS</h1>

            <nav className="flex flex-col *:leading-10 *:font-bold *:text-white! *:hover:bg-white/25! *:rounded *:duration-200 *:pl-4 *:[&.active]:bg-white! *:[&.active]:text-blue-500!">
                <NavLink end to="/painel">Home</NavLink>
                <NavLink end to="/painel/niveis">Niveis</NavLink>
            </nav>


        </header> 
    );
}
 
export default Menu;