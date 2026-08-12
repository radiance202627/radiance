'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastNotification({ toasts, onDismiss }: ToastNotificationProps) {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onDismiss(toasts[0].id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition text-xs font-semibold ${
            toast.type === 'success'
              ? 'bg-stone-900/90 text-emerald-300 border-emerald-500/40'
              : toast.type === 'error'
              ? 'bg-stone-900/90 text-red-300 border-red-500/40'
              : 'bg-stone-900/90 text-sky-300 border-sky-500/40'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />}
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
