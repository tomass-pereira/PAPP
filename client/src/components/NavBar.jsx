import { Link, useLocation } from "react-router-dom";
import SmoothScroll from "./SmoothScroll";

function NavBar() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/LoginPage";
  const isCreatePage = location.pathname === "/Registar";
  const isInicioPage = location.pathname === "/Inicio";
  const isFirstPage = location.pathname === "/";

  return (
    <nav className="flex items-center justify-between bg-white py-4 px-8 border-b top-0 z-50 w-full" >
      <div className="flex items-center">
        <img src="../imgs/logo-minii.png" alt="Logo" className="w-14 h-14" />
        <Link to="/" className="text-indigo-600 text-2xl font-bold no-underline">
          FisioHome
        </Link>
      </div>

      {isFirstPage && (
        <>
          <div className="flex gap-8">
            <SmoothScroll
              targetId="inicio"
              className="text-gray-800 text-base hover:text-[#4F4FB9] mr-4 cursor-pointer"
              onClick={() => setActiveTarget('inicio')}
            >
              Inicio
            </SmoothScroll>

            <SmoothScroll
              targetId="servicos"
              className="text-gray-800 text-base hover:text-[#4F4FB9] mr-4 cursor-pointer"
              onClick={() => setActiveTarget('servicos')}
            >
              Serviços
            </SmoothScroll>

            <SmoothScroll
              targetId="contactos"
              className="text-gray-800 text-base hover:text-[#4F4FB9] mr-4 cursor-pointer"
              onClick={() => setActiveTarget('contactos')}
            >
              Contactos
            </SmoothScroll>

          
          </div>

          <div>
            <Link className="text-gray-800 no-underline mr-5" to="Registar">
              Registar
            </Link>
            <Link
              className="py-2 px-6 bg-[#4f4fb9] text-white rounded-md text-base transition hover:bg-[#3e3e9e]"
              to="LoginPage"
            >
              Iniciar sessão
            </Link>
          </div>
        </>
      )}

      {isLoginPage && (
        <Link className="text-gray-800 no-underline mr-5" to="/Registar">
          Registar
        </Link>
      )}

      {isCreatePage && (
        <Link
          className="py-2 px-6 bg-[#4f4fb9] text-white rounded-md text-base transition hover:bg-[#3e3e9e]"
          to="/LoginPage"
        >
          Iniciar sessão
        </Link>
      )}

      {isInicioPage && (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Perfil
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Definições</a>
            </li>
            <li>
              <a>Terminar sessão</a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default NavBar;