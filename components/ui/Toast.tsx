'use client';

import React, { useEffect } from 'react';

type ToastProps = {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  onClose: () => void;
};

// NOTICE: We removed 'default' here to match the Profile page import
export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out hover:scale-105 flex items-center gap-2 ${bgColors[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:text-gray-200">✕</button>
    </div>
  );
}