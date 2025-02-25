import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Home,
  Bell
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'appointments', label: 'Consultas', icon: Clock },
    { id: 'notifications', label: 'Notificações', icon: Bell },
  ];

  return (
    <div className={`
      h-screen bg-white border-r relative
      ${isCollapsed ? 'w-20' : 'w-64'}
      transition-all duration-300 ease-in-out
    `}>
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
          <span className="ml-3 font-semibold text-indigo-600">FisioHome</span>
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
              <p className="font-medium text-gray-800">Dr. Silva</p>
              <p className="text-sm text-indigo-600">Fisioterapeuta</p>
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
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`
                    flex items-center w-full p-3 rounded-lg transition-colors
                    ${activeItem === item.id 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                    }
                  `}
                >
                  <Icon size={20} />
                  {!isCollapsed && (
                    <span className="ml-3">{item.label}</span>
                  )}
                </button>
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
              {!isCollapsed && (
                <span className="ml-3">Configurações</span>
              )}
            </button>
          </li>
          <li>
            <button className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg">
              <LogOut size={20} />
              {!isCollapsed && (
                <span className="ml-3">Sair</span>
              )}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;