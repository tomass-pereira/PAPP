import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  Dumbbell,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Bell,
} from "lucide-react";

const Sidebar = () => {
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  

  


  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/Inicio" },
    {
      id: "calendar",
      label: "Calendário",
      icon: Calendar,
      path: "/AgendarSessao",
    },
    {
      id: "Exercicios",
      label: "Exercicios",
      icon: Dumbbell,
      path: "/exercicios",
    },
    {
      id: "appointments",
      label: "Consultas",
      icon: Clock,
      path: "/MinhasSessoes",
    },
    { id: "notifications", label: "Notificações", icon: Bell },
  ];

  const handleLogout = () => {
    // Implementar a lógica de logout aqui
    console.log("Logout realizado");
    setShowLogoutDialog(false);
  };
  

  return (
    <>
      <div
        className={`
        h-screen bg-white border-r relative
        ${isCollapsed ? "w-20" : "w-64"}
        transition-all duration-300 ease-in-out
        ${showLogoutDialog ? "blur-sm" : ""}
      `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-white border rounded-full p-1.5 hover:bg-gray-50 text-indigo-600"
        >
          {isCollapsed ? <Menu size={16} /> : <X size={16} />}
        </button>

        {/* Logo Area */}
        <div className="flex items-center p-4 border-b">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold">
            F
          </div>
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
              src="/api/placeholder/40/40"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-indigo-600"
            />
            {!isCollapsed && (
              <div className="ml-3">
                <p className="font-medium text-gray-800">Tomás Pereira</p>
                <p className="text-sm text-indigo-600">Utente</p>
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
                    onClick={() => setActiveItem(item.path)}
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
        <div className="absolute bottom-0 w-full p-4 border-t">
          <ul className="space-y-2">
            <li>
              <button className="flex items-center w-full p-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg">
                <Settings size={20} />
                {!isCollapsed && <span className="ml-3">Configurações</span>}
              </button>
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
              onClick={handleLogout}
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
