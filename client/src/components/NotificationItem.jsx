import React from 'react';
import { Check, X, Clock, Info, AlertTriangle, Bell, MessageSquare } from 'lucide-react';

const NotificationItem = ({ notification, icon, onDismiss }) => {
  // Get background and border colors based on notification type
  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-500',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
    }
  };

  const typeStyles = getTypeStyles();
  
  // Get default icon if not provided
  const getDefaultIcon = () => {
    switch (notification.type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div 
      className={`relative rounded-lg p-4 transition-all duration-200 ${
        notification.read ? 'bg-white hover:bg-gray-50' : `${typeStyles.bg} hover:bg-white`
      }`}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-indigo-500"></div>
      )}
      
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 rounded-full p-2 ${typeStyles.iconBg}`}>
          {icon || getDefaultIcon()}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate pr-8">
              {notification.title}
            </h3>
            
            {onDismiss && (
              <button 
                onClick={() => onDismiss(notification.id)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {notification.time}
            </span>
            
            {!notification.read && (
              <span className="text-xs font-medium text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full">
                Nova
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;