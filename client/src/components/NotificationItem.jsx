import React from 'react';
import { Check, X, Clock, Info } from 'lucide-react';  // Adicionando esta linha

const NotificationItem = ({ notification, onDismiss }) => {
    const getIcon = () => {
      switch (notification.type) {
        case 'success':
          return <Check className="w-5 h-5 text-green-500" />;
        case 'warning':
          return <Clock className="w-5 h-5 text-yellow-500" />;
        default:
          return <Info className="w-5 h-5 text-blue-500" />;
      }
    };
  
    return (
      <div
        className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${
          notification.read ? 'border-gray-200' : 'border-blue-500'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="mt-1">{getIcon()}</div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {notification.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {notification.message}
              </p>
              <span className="mt-2 text-xs text-gray-400">
                {notification.time}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onDismiss(notification.id)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };
  export default NotificationItem;