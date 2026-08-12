'use client';

import React from 'react';
import { useQuote } from '@/context/QuoteContext';
import { CheckCircle2, X, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const Toast: React.FC = () => {
  const { toast, hideToast, totalItemsCount } = useQuote();

  if (!toast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up bg-brand-charcoal text-white rounded-lg p-4 shadow-floating border border-brand-brass/40 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-brand-brass/20 text-brand-brass rounded-full mt-0.5">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-display text-sm font-semibold text-white">{toast.message}</p>
          {toast.productName && (
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{toast.productName}</p>
          )}
          <div className="mt-2.5 flex items-center gap-3">
            <Link
              href="/quote"
              className="text-xs font-medium text-brand-brass hover:text-brand-brass-light transition-colors underline underline-offset-2 flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              View Quote List ({totalItemsCount})
            </Link>
          </div>
        </div>
        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
