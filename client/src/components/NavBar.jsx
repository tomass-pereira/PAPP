import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import SmoothScroll from "./SmoothScroll";

function NavBar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoginPage = location.pathname === "/LoginPage";
  const isCreatePage = location.pathname === "/Registar";
  const isInicioPage = location.pathname === "/Inicio";
  const isFirstPage = location.pathname === "/";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      {isFirstPage && (
        <>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
            <SmoothScroll
              targetId="inicio"
              className="text-gray-800 text-base hover:text-[#4F4FB9] cursor-pointer"
            >
              Inicio
            </SmoothScroll>

            <SmoothScroll
              targetId="servicos"
              className="text-gray-800 text-base hover:text-[#4F4FB9] cursor-pointer"
            >
              Serviços
            </SmoothScroll>

            <SmoothScroll
              targetId="contactos"
              className="text-gray-800 text-base hover:text-[#4F4FB9] cursor-pointer"
            >
              Contactos
            </SmoothScroll>
          </div>
        </>
      )}

      {/* Botões de autenticação para mobile */}
      <div className="md:hidden flex flex-col items-center gap-4 mt-4">
        {isFirstPage && (
          <>
            <Link 
              className="text-gray-800 no-underline" 
              to="/Registar"
              onClick={closeMenu}
            >
              Registar
            </Link>
            <Link
              className="py-2 px-6 bg-indigo-600 text-white rounded-md text-base transition hover:bg-indigo-700"
              to="/LoginPage"
              onClick={closeMenu}
            >
              Iniciar sessão
            </Link>
          </>
        )}
        {isLoginPage && (
          <Link 
            className="text-gray-800 no-underline" 
            to="/Registar"
            onClick={closeMenu}
          >
            Registar
          </Link>
        )}
      </div>
    </>
  );

  return (
    <nav className="relative flex items-center justify-between bg-white h-20 px-4 md:px-8 border-b top-0 z-50 w-full">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link to="/">
          <img 
            src="/imgs/fisiohome.svg" 
            alt="FisioHome Logo" 
            className="h-44 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Desktop and Mobile Menu */}
      <div className={`${
        isMenuOpen ? 'block' : 'hidden'
      } absolute top-full left-0 w-full bg-white md:static md:block md:flex-1 shadow-lg md:shadow-none p-4 md:p-0`}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <NavLinks />
        </div>
      </div>

      {/* Botões de autenticação para desktop */}
      {(isFirstPage ) && (
        <div className="hidden md:flex flex-row items-center gap-4">
          {isFirstPage && (
            <>
              <Link 
                className="text-gray-800 no-underline" 
                to="/Registar"
              >
                Registar
              </Link>
              <Link
                className="py-2 px-6 bg-indigo-600 text-white rounded-md text-base transition hover:bg-indigo-700"
                to="/LoginPage"
              >
                Iniciar sessão
              </Link>
            </>
          )}
          {isLoginPage && (
            <Link 
              className="text-gray-800 no-underline" 
              to="/Registar"
            >
              Registar
            </Link>
          )}
        </div>
      )}

      {/* Profile Dropdown ou Hamburger Menu */}
      {isInicioPage ? (
        <div className="flex-shrink-0">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
             
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
              <li><a>Definições</a></li>
              <li><a>Terminar sessão</a></li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="md:hidden flex-shrink-0">
          <button 
            onClick={toggleMenu} 
            className="text-gray-800 focus:outline-none"
          >
            {isMenuOpen ? (
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />        
              </svg>
            ) : (
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            )}
          </button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;