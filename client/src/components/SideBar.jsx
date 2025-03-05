import React, { useState } from "react";
import { useUser } from "../contexts/UserContext.jsX";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  BookOpen,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Bell,
  Users
} from "lucide-react";
import { useNotificacoes } from "../contexts/NotificacaoContext";

const Sidebar = () => {
  const { userData, logout, isFisio } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { naoLidas } = useNotificacoes();

  // Se não tiver dados do usuário, não mostra nada
  if (!userData) {
    return null;
  }

  // Cria notificação com badge de não lidas
  const NotificationIcon = ({ size, className }) => (
    <div className="relative">
      <Bell size={size} className={className} />
      {naoLidas > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {naoLidas > 99 ? "99+" : naoLidas}
        </div>
      )}
    </div>
  );

  // Define os itens do menu com base no tipo de usuário
  const menuItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: Home, 
      path:  "/Inicio" 
    },
    {
      id: "calendar",
      label: "Calendário",
      icon: Calendar,
      path: isFisio ? "/Fisio/Calendario" : "/AgendarSessao",
    },
    // Item exclusivo para utentes
    ...(!isFisio ? [
      {
        id: "Planos",
        label: "Planos de Tratamento",
        icon: BookOpen,
        path: "/planosTratamento",
      }
    ] : []),
    // Item exclusivo para administradores/fisioterapeutas
    ...(isFisio ? [
      {
        id: "patients",
        label: "Pacientes",
        icon: Users,
        path: "/Admin/Pacientes",
      }
    ] : []),
    {
      id: "appointments",
      label: isFisio ? "Consultas" : "Sessões",
      icon: Clock,
      path:isFisio ? "/Admin/Consultas" : "/MinhasSessoes",
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: NotificationIcon,
      path: isFisio ? "/Admin/Notificacoes" : "/NotificationsPage",
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md text-indigo-600 hover:bg-gray-50"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`
          fixed md:relative h-screen bg-white border-r 
          ${isCollapsed ? "w-20" : "w-64"}
          transition-all duration-300 ease-in-out
          ${showLogoutDialog ? "blur-sm" : ""}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          z-40
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-white border rounded-full p-1.5 hover:bg-gray-50 text-indigo-600 hidden md:block"
        >
          {isCollapsed ? <Menu size={16} /> : <X size={16} />}
        </button>

        {/* Logo Area */}
        <div className="flex items-center p-4 border-b">
          <img 
            src="/imgs/sss.png" 
            alt="Logo" 
            className="w-12 h-12 object-contain" 
          />
          {!isCollapsed && (
            <span className="ml-3 font-semibold text-indigo-600">
              FisioHome
            </span>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-b">
          <div className="flex items-center">
            <img
              src={userData.profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-indigo-600 object-cover"
            />
            {!isCollapsed && (
              <div className="ml-3">
                <p className="font-medium text-gray-800">{userData.nome}</p>
                <p className="text-sm text-indigo-600">{isFisio ? "Fisioterapeuta" : "Utente"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      setActiveItem(item.path);
                      setIsMobileOpen(false);
                    }}
                    className={`
                      flex items-center w-full p-3 rounded-lg transition-colors
                      ${
                        activeItem === item.path
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                      }
                    `}
                  >
                    <Icon size={20} />
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-white">
          <ul className="space-y-2">
            <li>
              <Link
                to={isFisio ? "/Admin/Config" : "/Config"}
                className="flex items-center w-full p-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg"
              >
                <Settings size={20} />
                {!isCollapsed && <span className="ml-3">Configurações</span>}
              </Link>
            </li>
            <li>
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={20} />
                {!isCollapsed && <span className="ml-3">Sair</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Logout Dialog */}
      <div
        className={`
          fixed inset-0 z-50 
          ${showLogoutDialog ? "opacity-100" : "opacity-0 pointer-events-none"}
          transition-opacity duration-300 ease-in-out
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setShowLogoutDialog(false)}
        />

        {/* Modal */}
        <div
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl
            transition-all duration-300 ease-in-out
            ${showLogoutDialog ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          `}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Terminar Sessão
            </h3>
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600 mb-6">
            Tem a certeza que pretende terminar sessão?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Terminar Sessão
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;