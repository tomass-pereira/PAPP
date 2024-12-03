import { Link, useLocation } from "react-router-dom";


function NavBar() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/LoginPage";
  const isCreatePage = location.pathname === "/Registar";
  const isInicioPage = location.pathname === "/Inicio";
  const isFirstPage = location.pathname === "/";



  return (
    <nav className="flex items-center justify-between bg-white py-4 px-8 shadow-md">
      <div className="flex items-center">
      <img src="../imgs/logo-minii.png" alt="Logo" className="w-14 h-14 "/>       
       <Link to="/" className="text-blue-500 text-2xl font-bold no-underline">
          FisioHome
        </Link>
      </div>
      {isFirstPage ? (
        <>
          <div className="flex gap-8">
            <Link to="/" className="text-gray-800 text-base hover:text-[#4F4FB9] mr-4">
              Inicio
            </Link>
            <a
              href="#about"
              className="text-gray-800 text-base hover:text-[#4F4FB9]"
            >
              Sobre
            </a>
            <a
              href="#services"
              className="text-gray-800 text-base hover:text-[#4F4FB9]"
            >
              Serviços
            </a>
            <a
              href="#contact"
              className="text-gray-800 text-base hover:text-[#4F4FB9]"
            >
              Contato
            </a>
          </div>
          

          <div>
            <Link className=" text-gray-800 no-underline mr-5" to="Registar" >
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
         <Link className="text-gray-800 no-underline mr-5" to="/Registar" >
         Registar
       </Link>
      ):null
      }
      {isCreatePage ? (
        <Link
        className=" py-2 px-6 bg-[#4f4fb9] text-white rounded-md text-base hover:bg-[#3e3e9e] "
        to="/LoginPage"
      >
        Iniciar sessão
      </Link>
      ):null
      }
      {isInicioPage ? (
       
        <div className="mr-4 rounded-full bg-gray-200 p-1">
        <img src="" alt="Foto de perfil" className="rounded-full bg-gray-200 p-1" />
          
      </div>
      ):null}
       

    </nav>
  );
}

export default NavBar;
