'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-stone-100">{title}</h3>
            <p className="text-sm text-stone-400 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-stone-800/80">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-stone-950 border border-stone-800 text-stone-300 hover:text-stone-100 rounded-xl text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition flex items-center gap-2 ${
              confirmVariant === 'danger'
                ? 'bg-red-500 hover:bg-red-400 text-white'
                : confirmVariant === 'warning'
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-white'
            }`}
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
