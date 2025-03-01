import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Bell, 
  Home, 
  ChevronRight, 
  Users, 
  Activity, 
  ArrowUp, 
  ArrowDown,
  Filter,
  Sparkles,
  Zap,
  TrendingUp
} from "lucide-react";
import SideBar from "../../components/SideBar";
import { useUser } from '../../contexts/UserContext.jsX';
import { useSessoes } from "../../contexts/SessoesContext.jsx";
import { useNotificacoes } from "../../contexts/NotificacaoContext.jsx";
import ProgressDashboard from "../../components/ProgressDashboard.jsx";

export default function Inicio() {
  const navigate = useNavigate();
  const { sessoesReservadas } = useSessoes();
  const { notificacoes, naoLidas } = useNotificacoes();
  const { userData, IsFisio } = useUser();
  const [dashboardVisible, setDashboardVisible] = useState(true);
  
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/LoginPage");
    }
  }, [navigate]);

  const handleNavigate = (path) => {
    navigate(path);
  };
  
  const proximaSessao = sessoesReservadas[0];
  let dataFormatada = '';
  let horaFormatada = '';
  
  if (proximaSessao) {
    const data = new Date(proximaSessao.dataHoraInicio);
    dataFormatada = data.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    horaFormatada = data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Resumo de estatísticas simplificadas
  const statsData = {
    sessõesRealizadas: 12,
    sessoesAgendadas: sessoesReservadas.length,
    progressoGeral: 65,
    tendencia: "positiva"
  };

  return (
    <div className={`min-h-screen ${IsFisio ? 'bg-gray-100' : 'bg-gray-50'}`}>
      <div className="flex">
        <SideBar />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {/* Header com boas-vindas e próxima sessão */}
          <div className={`bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6 ${
            IsFisio ? 'border-l-4 border-teal-500' : 'border-l-4 border-indigo-600'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                  Olá, {IsFisio ? `Dr. ${userData.nome}` : userData.nome}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  {IsFisio 
                    ? "Bem-vindo(a) ao seu painel de atendimento"
                    : "Bem-vindo(a) ao seu painel de fisioterapia"
                  }
                </p>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                <div className={`text-left sm:text-right p-2 sm:p-3 rounded-xl ${
                  proximaSessao 
                    ? `${IsFisio ? 'bg-teal-50' : 'bg-indigo-50'} border border-opacity-40 ${
                        IsFisio ? 'border-teal-200' : 'border-indigo-200'
                      }`
                    : ''
                }`}>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    {IsFisio ? 'Próximo atendimento' : 'Próxima sessão'}
                  </p>
                  {proximaSessao ? (
                    <p className="text-sm font-semibold text-gray-800">{dataFormatada}, {horaFormatada}</p>
                  ) : (
                    <p className="text-sm font-medium text-gray-600">Nenhuma sessão agendada</p>
                  )}
                </div>
                <div 
                  className="relative cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => handleNavigate('/NotificationsPage')}
                >
                  <Bell className={`w-6 h-6 text-gray-600 hover:text-blue-500`} />
                  {naoLidas > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {naoLidas > 99 ? '99+' : naoLidas}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`bg-white p-4 rounded-xl shadow-sm ${
              IsFisio ? 'border-t-4 border-teal-400' : 'border-t-4 border-indigo-400'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <p className="text-gray-500 text-sm">Sessões Realizadas</p>
                <div className={`p-1.5 rounded-full ${
                  IsFisio ? 'bg-teal-100 text-teal-600' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{statsData.sessõesRealizadas}</p>
              <div className="flex items-center text-green-600 text-xs mt-2">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                <span>+20% que mês anterior</span>
              </div>
            </div>

            <div className={`bg-white p-4 rounded-xl shadow-sm ${
              IsFisio ? 'border-t-4 border-indigo-400' : 'border-t-4 border-green-400'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <p className="text-gray-500 text-sm">Sessões Agendadas</p>
                <div className={`p-1.5 rounded-full ${
                  IsFisio ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'
                }`}>
                  <Calendar className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{statsData.sessoesAgendadas}</p>
              <div className="flex items-center text-gray-500 text-xs mt-2">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>Próximos 30 dias</span>
              </div>
            </div>

            <div className={`bg-white p-4 rounded-xl shadow-sm ${
              IsFisio ? 'border-t-4 border-cyan-400' : 'border-t-4 border-purple-400'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <p className="text-gray-500 text-sm">Progresso Geral</p>
                <div className={`p-1.5 rounded-full ${
                  IsFisio ? 'bg-cyan-100 text-cyan-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  <Zap className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{statsData.progressoGeral}%</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div 
                  className={`h-1.5 rounded-full ${
                    IsFisio ? 'bg-cyan-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${statsData.progressoGeral}%` }}
                ></div>
              </div>
            </div>

            <div className={`bg-white p-4 rounded-xl shadow-sm ${
              IsFisio ? 'border-t-4 border-amber-400' : 'border-t-4 border-blue-400'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <p className="text-gray-500 text-sm">Tendência</p>
                <div className={`p-1.5 rounded-full ${
                  IsFisio ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">Ótima</p>
              <div className="flex items-center text-green-600 text-xs mt-2">
                <ArrowUp className="w-3.5 h-3.5 mr-1" />
                <span>Em evolução constante</span>
              </div>
            </div>
          </div>

          {/* Cards de Ações Principais - Visual aprimorado */}
         

          {/* Dashboard Toggle Section */}
          <div className="mb-2 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className={`text-lg font-semibold ${
                IsFisio ? 'text-teal-700' : 'text-indigo-700'
              }`}>
                Dashboard Analítico
              </h2>
              <div className={`ml-3 text-xs px-2 py-1 rounded-full ${
                IsFisio ? 'bg-teal-100 text-teal-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                Atualizado hoje
              </div>
            </div>
            <button 
              onClick={() => setDashboardVisible(!dashboardVisible)}
              className={`p-2 rounded-lg transition-colors ${
                IsFisio 
                  ? 'hover:bg-teal-50 text-teal-600' 
                  : 'hover:bg-indigo-50 text-indigo-600'
              }`}
            >
              {dashboardVisible ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Dashboard Collapsible */}
          {dashboardVisible && (
            <div className="mb-6 transition-all duration-300 ease-in-out">
              <ProgressDashboard isFisio={IsFisio} />
            </div>
          )}

          {/* Bottom Section - Próximas Sessões e Notificações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card de Próximas Sessões */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-lg ${IsFisio ? 'bg-indigo-100' : 'bg-blue-100'}`}>
                      <Calendar className={`w-5 h-5 ${IsFisio ? 'text-indigo-600' : 'text-blue-500'}`} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {IsFisio ? 'Próximos Atendimentos' : 'Próximas Sessões'}
                    </h2>
                  </div>
                  <button 
                    onClick={() => handleNavigate('/MinhasSessoes')}
                    className={`flex items-center font-medium group ${
                      IsFisio 
                        ? 'text-indigo-600 hover:text-indigo-800' 
                        : 'text-blue-500 hover:text-blue-700'
                    }`}
                  >
                    Ver {IsFisio ? 'todos' : 'todas'}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                {sessoesReservadas.slice(0,2).map((sessao) => {
                  const data = new Date(sessao.dataHoraInicio);
                  const dataFormatada = data.toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  });
                  const horaFormatada = data.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  // Calcular se a sessão é hoje
                  const hoje = new Date();
                  const isHoje = data.getDate() === hoje.getDate() && 
                                data.getMonth() === hoje.getMonth() &&
                                data.getFullYear() === hoje.getFullYear();

                  return (
                    <div 
                      key={sessao._id}
                      className={`flex items-start space-x-3 mb-3 last:mb-0 p-3 rounded-lg transition-colors ${
                        IsFisio ? 'hover:bg-indigo-50' : 'hover:bg-blue-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isHoje 
                          ? 'bg-amber-100' 
                          : IsFisio ? 'bg-indigo-100' : 'bg-blue-100'
                      }`}>
                        {IsFisio ? (
                          <Users className={`w-4 h-4 ${
                            isHoje ? 'text-amber-600' : 'text-indigo-600'
                          }`} />
                        ) : (
                          <Calendar className={`w-4 h-4 ${
                            isHoje ? 'text-amber-600' : 'text-blue-500'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-800">{dataFormatada}</p>
                          {isHoje && (
                            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                              Hoje
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {IsFisio ? 'Atendimento Domiciliar' : 'Fisioterapia'}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {horaFormatada} - {IsFisio ? 'Paciente em domicílio' : 'Domicílio'}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {sessoesReservadas.length === 0 && (
                  <div className="text-gray-500 text-center py-6">
                    <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">
                      {IsFisio 
                        ? 'Não há atendimentos agendados no momento' 
                        : 'Não há sessões agendadas no momento'
                      }
                    </p>
                    <button 
                      onClick={() => handleNavigate('/AgendarSessao')}
                      className={`mt-3 px-4 py-2 text-sm rounded-lg ${
                        IsFisio 
                          ? 'bg-teal-100 text-teal-700 hover:bg-teal-200' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      Agendar agora
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Card de Notificações */}
            <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow ${
              IsFisio ? 'border-t-4 border-teal-400' : ''
            }`}>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-lg ${IsFisio ? 'bg-teal-100' : 'bg-purple-100'}`}>
                      <Bell className={`w-5 h-5 ${IsFisio ? 'text-teal-600' : 'text-purple-500'}`} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Notificações Recentes</h2>
                  </div>
                  <button 
                    onClick={() => handleNavigate('/NotificationsPage')}
                    className={`flex items-center font-medium group ${
                      IsFisio 
                        ? 'text-teal-600 hover:text-teal-800' 
                        : 'text-blue-500 hover:text-blue-700'
                    }`}
                  >
                    Ver todas
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                {notificacoes.length === 0 && (
                  <div className="text-gray-500 text-center py-6">
                    <Bell className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Não há notificações no momento</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Novas atividades aparecerão aqui
                    </p>
                  </div>
                )}
                {notificacoes.slice(0,3).map((notificacao) => (
                  <div 
                    key={notificacao._id}
                    className={`mb-3 last:mb-0 p-3 rounded-lg cursor-pointer transition-colors ${
                      IsFisio ? 'hover:bg-teal-50' : 'hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 ${
                        !notificacao.lido 
                          ? IsFisio ? 'bg-teal-100' : 'bg-purple-100'
                          : 'bg-gray-100'
                      }`}>
                        <Bell className={`w-3.5 h-3.5 ${
                          !notificacao.lido 
                            ? IsFisio ? 'text-teal-600' : 'text-purple-600'
                            : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className={`font-medium ${
                            !notificacao.lido ? 'text-gray-800' : 'text-gray-600'
                          }`}>{notificacao.titulo}</h3>
                          {!notificacao.lido && (
                            <span className={`h-2 w-2 rounded-full flex-shrink-0 ${
                              IsFisio ? 'bg-teal-500' : 'bg-purple-500'
                            }`}></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{notificacao.descricao}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(notificacao.tempo).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Icones que precisam ser importados adicionalmente
function ChevronUp(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6"/>
    </svg>
  );
}

function ChevronDown(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

function Check(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function Phone(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}