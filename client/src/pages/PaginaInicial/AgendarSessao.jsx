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
          <div className="bg-white rounded-lg shadow-lg p-2 md:p-6 mb-4  overflow-y-auto">
            <CalendarApp />
          </div>

          {/* Cards Informativos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4 mb-4">
            <div className="bg-[#EEF2FF] p-3 md:p-4 rounded-lg">
              <div className="text-indigo-600 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                Agendamento
              </div>
              <p className="text-xs md:text-sm text-gray-600">
                Sessão padrão de fisioterapia com duração de 45 minutos.
                Necessária confirmação até 2h antes.
              </p>
              <p className="text-xs md:text-sm font-medium text-indigo-600 mt-2">
                Duração: 45 min
              </p>
            </div>

            <div className="bg-[#EEF2FF] p-3 md:p-4 rounded-lg">
              <div className="text-indigo-600 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                Política de Cancelamento
              </div>
              <p className="text-xs md:text-sm text-gray-600">
                Cancelamentos com menos de 2h de antecedência terão taxa de 50%
                do valor para reagendamento.
              </p>
              <p className="text-xs md:text-sm font-medium text-indigo-600 mt-2">
                Aviso: 2h antes
              </p>
            </div>

            <div className="bg-[#EEF2FF] p-3 md:p-4 rounded-lg">
              <div className="text-indigo-600 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                Cancelamentos Recorrentes
              </div>
              <p className="text-xs md:text-sm text-gray-600">
                Dois cancelamentos consecutivos resultam em taxa adicional de
                25% na próxima sessão.
              </p>
              <p className="text-xs md:text-sm font-medium text-indigo-600 mt-2">
                Política de Fidelidade
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
