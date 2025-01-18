import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import SmoothScroll from "../components/SmoothScroll.jsx";

function NavBar(props) {
  const location = useLocation();
  const [activeTarget, setActiveTarget] = useState('');
  const isLoginPage = location.pathname === "/LoginPage";
  const isCreatePage = location.pathname === "/Registar";
  const isInicioPage = location.pathname === "/Inicio";
  const isFirstPage = location.pathname === "/";
 

  return (
    <nav className="flex items-center justify-between bg-white py-4 px-8 border-b ">
      <div className="flex items-center">
        <img src="../imgs/logo-minii.png" alt="Logo" className="w-14 h-14 " />
        <Link to="/" className="text-blue-500 text-2xl font-bold no-underline">
          FisioHome
        </Link>
      </div>
      {isFirstPage ? (
        <>
          <div className="flex gap-8">
            <Link
              to="/"
              className="text-gray-800 text-base hover:text-[#4F4FB9] mr-4"
            >
              Inicio
            </Link>
            <SmoothScroll
              targetId="servicos"
              className="text-gray-800 text-base hover:text-[#4F4FB9] mr-4"
              onClick={() => setActiveTarget('servicos')}
            >
              Serviços
              
            </SmoothScroll>
            <SmoothScroll
              targetId={props.target}
              className="text-gray-800 text-base hover:text-[#4F4FB9] mr-4"
              onClick={() => setActiveTarget('contactos')}
            >
              Contactos
              
            </SmoothScroll>
            <a
              href="#contact"
              className="text-gray-800 text-base hover:text-[#4F4FB9]"
            >
              Sobre
            </a>
          </div>

          <div>
            <Link className=" text-gray-800 no-underline mr-5" to="Registar">
              Registar
            </Link>
            <Link
              className=" py-2 px-6 bg-[#0d6efd] text-white rounded-md text-base hover:bg-[#2f538a]"
              to="LoginPage"
            >
              Iniciar sessão
            </Link>
          </div>
        </>
      ) : null}
      {isLoginPage ? (
        <Link className="text-gray-800 no-underline mr-5" to="/Registar">
          Registar
        </Link>
      ) : null}
      {isCreatePage ? (
        <Link
          className=" py-2 px-6 bg-[#4f4fb9] text-white rounded-md text-base hover:bg-[#3e3e9e] "
          to="/LoginPage"
        >
          Iniciar sessão
        </Link>
      ) : null}
      {isInicioPage ? (
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
      ) : null}
    </nav>
  );
}

export default NavBar;
