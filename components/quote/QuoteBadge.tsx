'use client';

import React from 'react';
import Link from 'next/link';
import { useQuote } from '@/context/QuoteContext';
import { FileText } from 'lucide-react';

export const QuoteBadge: React.FC = () => {
  const { totalItemsCount } = useQuote();

  return (
    <Link
      href="/quote"
      className="relative inline-flex items-center gap-2 px-4 py-2 bg-brand-brass hover:bg-brand-brass-dark text-white font-display text-xs font-semibold uppercase tracking-wider rounded transition-all duration-200 shadow-sm hover:shadow"
    >
      <FileText className="w-4 h-4" />
      <span>Request a Quote</span>
      {totalItemsCount > 0 && (
        <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold bg-white text-brand-dark rounded-full">
          {totalItemsCount}
        </span>
      )}
    </Link>
  );
};
