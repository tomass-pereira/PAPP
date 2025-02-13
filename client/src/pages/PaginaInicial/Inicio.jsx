import React, { useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Bell, Home, ChevronRight } from "lucide-react"; // Adicionei ChevronRight
import SideBar from "../../components/SideBar"
import {useUser} from '../../contexts/UserContext.jsX';
import { useSessoes } from "../../contexts/SessoesContext.jsx";
import { useNotificacoes } from "../../contexts/NotificacaoContext.jsx";

export default function Inicio() {
  const { sessoesReservadas}=useSessoes();
  const {notificacoes, naoLidas}=useNotificacoes();
  const {userData} =useUser();
  const navigate=useNavigate();

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

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/LoginPage');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <SideBar />
        <main className="flex-1 p-8">
          {/* Cabeçalho com gradiente suave */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Olá, {userData.nome} 👋
      </h1>
      <p className="text-gray-600 text-lg">
        Bem-vindo(a) ao seu painel de fisioterapia domiciliar
      </p>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right  p-4 rounded-xl">
        <p className="text-sm text-gray-600 mb-1">Próxima sessão</p>
        {proximaSessao ? (
          <p className="font-semibold text-gray-800">{dataFormatada}, {horaFormatada}</p>
        ) : (
          <p className="font-medium text-gray-800">Nenhuma sessão agendada</p>
        )}
      </div>
      <div 
        className="relative cursor-pointer hover:scale-110 transition-transform"
        onClick={() => handleNavigate('/NotificationsPage')}
      >
        <Bell className="w-7 h-7 text-gray-600 hover:text-blue-500" />
        {naoLidas > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {naoLidas > 99 ? '99+' : naoLidas}
          </div>
        )}
      </div>
    </div>
  </div>
</div>

          {/* Cards de Ações Principais com efeitos de hover melhorados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div 
              className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-white group"
              onClick={() => handleNavigate('/AgendarSessao')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <Calendar className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-semibold">Agendar Sessão</h2>
              </div>
              <p className="text-blue-100">
                Agende uma nova sessão de fisioterapia
              </p>
            </div>

            <div 
              className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-white group"
              onClick={() => handleNavigate('/MinhasSessoes')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <Clock className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-semibold">Minhas Consultas</h2>
              </div>
              <p className="text-green-100">
                Visualize e gerencie suas consultas
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-white group">
              <div className="flex items-center space-x-4 mb-4">
                <Home className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-semibold">Atendimento</h2>
              </div>
              <div className="space-y-2">
                <p className="text-purple-100">Seg. a Sex.: 8h às 20h</p>
                <p className="text-purple-100">Sáb.: 8h às 14h</p>
              </div>
            </div>
          </div>

          {/* Seção de Próximas Sessões e Notificações com cards melhorados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card de Próximas Sessões */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Próximas Sessões</h2>
                  </div>
                  <button 
                    onClick={() => handleNavigate('/MinhasSessoes')}
                    className="flex items-center text-blue-500 hover:text-blue-700 font-medium group"
                  >
                    Ver todas
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="p-6">
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

                  return (
                    <div 
                      key={sessao._id}
                      className="flex items-start space-x-4 mb-4 last:mb-0 p-4 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{dataFormatada}</p>
                        <p className="text-gray-600">Fisioterapia</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {horaFormatada} - Domicílio
                        </p>
                      </div>
                    </div>
                  );
                })}
                {sessoesReservadas.length === 0 && (
                  <div className="text-gray-500 text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Não há sessões agendadas no momento</p>
                  </div>
                )}
              </div>
            </div>

            {/* Card de Notificações */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Bell className="w-6 h-6 text-purple-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Notificações Recentes</h2>
                  </div>
                  <button 
                    onClick={() => handleNavigate('/NotificationsPage')}
                    className="flex items-center text-blue-500 hover:text-blue-700 font-medium group"
                  >
                    Ver todas
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {notificacoes.length === 0 && (
                  <div className="text-gray-500 text-center py-8">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Não há notificações no momento</p>
                  </div>
                )}
                {notificacoes.slice(0,2).map((notificacao) => (
                  <div 
                    key={notificacao._id}
                    className="mb-4 last:mb-0 p-4 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{notificacao.titulo}</h3>
                        <p className="text-gray-600 mt-1">{notificacao.descricao}</p>
                        <p className="text-sm text-gray-500 mt-2 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
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