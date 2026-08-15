'use client';

import React from 'react';
import { useQuote } from '@/context/QuoteContext';
import { CheckCircle2, X, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const Toast: React.FC = () => {
  const { toast, hideToast, totalItemsCount } = useQuote();

  if (!toast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up bg-[#F4F2ED] text-[#222222] rounded-2xl p-4 shadow-xl border border-[#B08D57]/40 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-[#B08D57]/15 text-[#B08D57] rounded-full mt-0.5 border border-[#B08D57]/20">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-display text-sm font-semibold text-[#222222]">{toast.message}</p>
          {toast.productName && (
            <p className="text-xs text-[#666666] mt-0.5 line-clamp-1">{toast.productName}</p>
          )}
          <div className="mt-2.5 flex items-center gap-3">
            <Link
              href="/quote"
              className="text-xs font-medium text-[#B08D57] hover:text-[#9A7B4B] transition-colors underline underline-offset-2 flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              View Quote List ({totalItemsCount})
            </Link>
          </div>
        </div>
        <button
          onClick={hideToast}
          className="text-[#666666] hover:text-[#222222] p-1 rounded-md transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
