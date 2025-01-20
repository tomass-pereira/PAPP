// components/Alert.jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Alert({ message, onClose, show }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`
        fixed inset-0 z-50 
        ${show ? "opacity-100" : "opacity-0 pointer-events-none"}
        transition-opacity duration-300 ease-in-out
      `}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          bg-white rounded-lg w-full max-w-md mx-4 shadow-xl
          transition-all duration-300 ease-in-out
          ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        <div role="alert" className="border-s-4 border-red-500 p-4">
          <div className="flex items-center justify-between gap-2 text-red-800">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path
                  fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>

              <strong className="block font-medium">Algo correu mal</strong>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <p className="mt-2 text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
}