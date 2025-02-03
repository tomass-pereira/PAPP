import React from "react";
import NotificationItem from "../../components/NotificationItem.jsx";
import Sidebar from "../../components/SideBar.jsx";
import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      type: "info",
      title: "Nova atualização disponível",
      message: "Uma nova versão do sistema está disponível para download.",
      time: "5 min atrás",
      read: false,
    },
    {
      id: 2,
      type: "success",
      title: "Documento aprovado",
      message: "Seu relatório mensal foi aprovado pela gerência.",
      time: "1 hora atrás",
      read: true,
    },
    {
      id: 3,
      type: "warning",
      title: "Lembrete de reunião",
      message: "Reunião de equipe começa em 30 minutos.",
      time: "2 horas atrás",
      read: false,
    },
  ]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleDismiss = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const toggleReadStatus = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: !notification.read }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

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
                onClick={markAllAsRead}
                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                Marcar todas como lidas
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <X className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              Nenhuma notificação disponível
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={handleDismiss}
                  onToggleRead={toggleReadStatus}
                  icon={getIcon(notification.type)}
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