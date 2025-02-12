import React, { useEffect } from "react";
import NotificationItem from "../../components/NotificationItem.jsx";
import Sidebar from "../../components/SideBar.jsx";
import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { useNotificacoes } from "../../contexts/NotificacaoContext";
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
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleDismiss = async (id) => {
    try {
      await fetch(`/api/notificacoes/${id}/arquivar`, {
        method: 'PUT'
      });
      fetchNotificacoes();
    } catch (erro) {
      console.error('Erro ao arquivar notificação:', erro);
    }
  };

  const handleToggleRead = async (id) => {
    try {
      await toggleNotificacaoLeitura(id);
      fetchNotificacoes();
    } catch (erro) {
      console.error('Erro ao alterar estado de leitura:', erro);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const utenteId = sessionStorage.getItem("utenteId");
      if (utenteId) {
        await marcarTodasComoLidas(utenteId);
        fetchNotificacoes();
      }
    } catch (erro) {
      console.error('Erro ao marcar todas como lidas:', erro);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            Carregando notificações...
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
          <div className="text-center text-red-500">
            Erro ao carregar notificações: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto mt-8 sm:mt-0">
        <div className="max-w-4xl md:max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-indigo-600 flex items-center gap-2">
              <Bell className="w-6 h-6 text-indigo-600" />
              Notificações
            </h1>
            <div className="flex gap-4">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                Marcar todas como lidas
              </button>
            </div>
          </div>

          {notificacoes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <X className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              Nenhuma notificação disponível
            </div>
          ) : (
            <div className="space-y-4">
              {notificacoes.map((notificacao) => (
                <NotificationItem
                  key={notificacao._id}
                  notification={{
                    id: notificacao._id,
                    type: notificacao.tipo,
                    title: notificacao.titulo,
                    message: notificacao.descricao,
                    time: new Date(notificacao.tempo).toLocaleString(),
                    read: notificacao.lida
                  }}
                  onDismiss={handleDismiss}
                  onToggleRead={handleToggleRead}
                  icon={getIcon(notificacao.tipo)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;