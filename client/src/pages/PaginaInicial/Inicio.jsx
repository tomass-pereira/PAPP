import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Bell, Home } from "lucide-react";
import SideBar from "../../components/SideBar"
import {useUser} from '../../contexts/UserContext.jsX';
import { useSessoes } from "../../contexts/SessoesContext.jsx";

export default function Inicio() {
  const {sessoesReservadas}=useSessoes();
  const navigate = useNavigate();
  const {userData} =useUser();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/LoginPage');
    }
  }, [navigate]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const notificacoes = [
    {
      id: 1,
      titulo: "Confirmação de Agendamento",
      mensagem: "Sua sessão foi confirmada para amanhã às 14:30",
      data: "Hoje, 10:30"
    },
    {
      id: 2,
      titulo: "Lembrete de Sessão",
      mensagem: "Você tem uma sessão agendada para amanhã",
      data: "Ontem, 15:45"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <SideBar />
        <main className="flex-1 p-8">
          {/* Cabeçalho */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Olá, {userData.nome}
                </h1>
                <p className="text-gray-600 mt-2">
                  Bem-vindo(a) ao seu painel de fisioterapia domiciliar
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Próxima sessão</p>
                  <p className="font-medium text-gray-800">10 Março, 14:30</p>
                </div>
                <div 
                  className="relative cursor-pointer"
                  onClick={() => handleNavigate('/notificacoes')}
                >
                  <Bell className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    2
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cards de Ações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div 
              className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer text-white"
              onClick={() => handleNavigate('/agendar')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <Calendar className="w-8 h-8" />
                <h2 className="text-xl font-semibold">Agendar Sessão</h2>
              </div>
              <p className="text-blue-100">
                Agende uma nova sessão de fisioterapia
              </p>
            </div>

            <div 
              className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer text-white"
              onClick={() => handleNavigate('/consultas')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <Clock className="w-8 h-8" />
                <h2 className="text-xl font-semibold">Minhas Consultas</h2>
              </div>
              <p className="text-green-100">
                Visualize e gerencie suas consultas
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-sm text-white">
              <div className="flex items-center space-x-4 mb-4">
                <Home className="w-8 h-8" />
                <h2 className="text-xl font-semibold">Atendimento</h2>
              </div>
              <div className="space-y-2">
                <p className="text-purple-100">Seg. a Sex.: 8h às 20h</p>
                <p className="text-purple-100">Sáb.: 8h às 14h</p>
              </div>
            </div>
          </div>

          {/* Seção de Próximas Sessões e Notificações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card de Próximas Sessões */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Próximas Sessões</h2>
                  </div>
                  <button 
                    onClick={() => handleNavigate('/consultas')}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Ver todas
                  </button>
                </div>
              </div>
              <div className="p-6">
                {sessoesReservadas.map((sessao) => {
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
                      className="flex items-start space-x-4 mb-4 last:mb-0 p-4 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{dataFormatada}</p>
                        <p className="text-gray-600">Fisioterapia</p>
                        <p className="text-sm text-gray-500">{horaFormatada} - Domicílio</p>
                      </div>
                    </div>
                  );
                })}
                {sessoesReservadas.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Não há sessões agendadas no momento
                  </p>
                )}
              </div>
            </div>

            {/* Card de Notificações */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Bell className="w-6 h-6 text-purple-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Notificações Recentes</h2>
                  </div>
                  <button 
                    onClick={() => handleNavigate('/notificacoes')}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Ver todas
                  </button>
                </div>
              </div>
              <div className="p-6">
                {notificacoes.map((notificacao) => (
                  <div 
                    key={notificacao.id}
                    className="mb-4 last:mb-0 p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{notificacao.titulo}</h3>
                        <p className="text-gray-600 mt-1">{notificacao.mensagem}</p>
                      </div>
                      <span className="text-sm text-gray-500">{notificacao.data}</span>
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