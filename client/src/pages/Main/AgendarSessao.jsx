import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";
import CalendarApp from "../../components/Calendar/CalendarX";
export default function AgendarSessao() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/LoginPage");

    }
  }, [navigate]);
  
  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <SideBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 h-screen">
          {/* Cabeçalho */}
          <div className="mb-4 md:mb-8  top-0 bg-gray-50 z-10 pb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 text-center sm:text-left">
              Agende aqui a sua sessão!
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Escolha o melhor horário para seu tratamento
            </p>
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
            <div className="flex items-center">
              <div className="w-3 md:w-4 h-3 md:h-4 rounded bg-[#EADDFF] mr-2"></div>
              <span className="text-xs md:text-sm text-gray-600">
                Reservado
              </span>
            </div>
           
            <div className="flex items-center">
              <div className="w-3 md:w-4 h-3 md:h-4 rounded bg-green-400 mr-2"></div>
              <span className="text-xs md:text-sm text-gray-600">
                Disponível
              </span>
            </div>
          </div>

          {/* Calendário */}
            <CalendarApp />

          {/* Cards Informativos */}
       
        </main>
      </div>
    </>
  );
}
