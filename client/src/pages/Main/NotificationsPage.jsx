import React, { useEffect, useState } from "react";
import NotificationItem from "../../components/NotificationItem.jsx";
import Sidebar from "../../components/SideBar.jsx";
import { 
  Bell, CheckCircle, AlertTriangle, Info, X, Inbox, 
  Filter, ChevronDown, Calendar, Clock, Search, RefreshCw 
} from "lucide-react";
import { useNotificacoes } from "../../contexts/NotificacaoContext.jsx";
import { marcarTodasComoLidas} from "../../api/notificacao.js";

const NotificationsPage = () => {
  const { 
    notificacoes, 
    loading, 
    error,
    fetchNotificacoes, 
  } = useNotificacoes();

  // State for filters
  const [filter, setFilter] = useState("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Calculate notification stats
  const totalNotifications = notificacoes.length;
  const unreadCount = notificacoes.filter(notif => !notif.lida).length;
  
  // Filter notifications based on current filter and search term
  const filteredNotifications = notificacoes.filter(notif => {
    const matchesFilter = 
      filter === "todas" || 
      (filter === "nao-lidas" && !notif.lida) ||
      (filter === "tipo" && notif.tipo === "success") ||
      (filter === "warning" && notif.tipo === "warning") ||
      (filter === "error" && notif.tipo === "error") ||
      (filter === "info" && notif.tipo === "info");
    
    const matchesSearch = 
      notif.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    const marcarLidas = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (userId) {
          await marcarTodasComoLidas(userId);
          fetchNotificacoes();
        }
      } catch (erro) {
        console.error('Erro ao marcar notificações como lidas:', erro);
      }
    };

    marcarLidas();
  }, []); 

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchNotificacoes();
    setTimeout(() => setRefreshing(false), 500);
  };

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

  const getEmptyStateMessage = () => {
    if (filter !== "todas" && notificacoes.length > 0) {
      return {
        title: "Nenhuma notificação corresponde ao filtro",
        message: "Tente ajustar seus filtros ou remover o termo de pesquisa"
      };
    }
    return {
      title: "Nenhuma notificação",
      message: "Você não tem nenhuma notificação no momento."
    };
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 p-8 bg-white rounded-xl shadow-md">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              <Bell className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mt-2">Carregando notificações</h3>
            <p className="text-gray-500">Aguarde um momento enquanto recuperamos suas notificações</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Erro ao carregar notificações
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {error}
            </p>
            <button 
              onClick={fetchNotificacoes}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
          {/* Enhanced Header */}
          <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-1"></div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <Bell className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Notificações
                    </h1>
                    <p className="text-gray-500">
                      {totalNotifications > 0 
                        ? `${totalNotifications} notificações no total, ${unreadCount} não lidas` 
                        : "Nenhuma notificação para exibir"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleManualRefresh}
                    className="flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    title="Atualizar notificações"
                  >
                    <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                  
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marcar todas como lidas
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative sm:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Filter className="w-4 h-4 text-gray-400" />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                >
                  <option value="todas">Todas as notificações</option>
                  <option value="nao-lidas">Não lidas</option>
                  <option value="tipo">Sucesso</option>
                  <option value="warning">Avisos</option>
                  <option value="error">Erros</option>
                  <option value="info">Informativas</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar notificações..."
                  className="block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List or Empty State */}
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-10 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {getEmptyStateMessage().title}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {getEmptyStateMessage().message}
              </p>
              {filter !== "todas" && (
                <button
                  onClick={() => {
                    setFilter("todas");
                    setSearchTerm("");
                  }}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="divide-y">
                {filteredNotifications.map((notificacao, index) => (
                  <div 
                    key={notificacao._id || index} 
                    className={`p-4 sm:p-5 ${
                      !notificacao.lida ? 'bg-indigo-50/30' : ''
                    } hover:bg-gray-50 transition-colors`}
                  >
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;