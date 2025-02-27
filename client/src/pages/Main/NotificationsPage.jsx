import React, { useEffect } from "react";
import NotificationItem from "../../components/NotificationItem.jsx";
import Sidebar from "../../components/SideBar.jsx";
import { Bell, CheckCircle, AlertTriangle, Info, X, Inbox } from "lucide-react";
import { useNotificacoes } from "../../contexts/NotificacaoContext.jsx";
import { marcarTodasComoLidas} from "../../api/notificacao.js";

const NotificationsPage = () => {
  const { 
    notificacoes, 
    loading, 
    error,
    fetchNotificacoes, 
  } = useNotificacoes();

  useEffect(() => {
    const marcarLidas = async () => {
      try {
        const utenteId = sessionStorage.getItem("utenteId");
        if (utenteId) {
          await marcarTodasComoLidas(utenteId);
          fetchNotificacoes();
        }
      } catch (erro) {
        console.error('Erro ao marcar notificações como lidas:', erro);
      }
    };

    marcarLidas();
  }, []); 

  const getIcon = (tipo) => {
    switch (tipo) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default:
        return <Info className="w-5 h-5 text-sky-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Carregando notificações...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <p>Erro ao carregar notificações: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header com gradiente sutil */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <Bell className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Notificações
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Gerencie suas notificações e atualizações
                  </p>
                </div>
              </div>
              
              <button
               
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Marcar todas como lidas
              </button>
            </div>
          </div>

          {notificacoes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12">
              <div className="text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Nenhuma notificação
                </h3>
                <p className="text-gray-500">
                  Você não tem nenhuma notificação no momento.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm divide-y">
              {notificacoes.map((notificacao, index) => (
                <div key={notificacao._id} className={`p-4 ${
                  !notificacao.lida ? 'bg-indigo-50/30' : ''
                } hover:bg-gray-50 transition-colors`}>
                  <NotificationItem
                    notification={{
                      id: notificacao._id,
                      type: notificacao.tipo,
                      title: notificacao.titulo,
                      message: notificacao.descricao,
                      time: new Date(notificacao.tempo).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }),
                      read: notificacao.lida
                    }}
                   
                  
                    icon={getIcon(notificacao.tipo)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;