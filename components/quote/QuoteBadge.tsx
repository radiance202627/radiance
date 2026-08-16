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
      className="relative inline-flex items-center gap-2 px-4 py-2 bg-[#9E7B47] hover:bg-[#856637] text-[#FAF8F5] font-sans text-[11px] font-semibold uppercase tracking-[0.18em] rounded-[4px] transition-all duration-500 shadow-none border border-[#9E7B47]"
    >
      <FileText className="w-3.5 h-3.5 stroke-[1.5]" />
      <span className="hidden sm:inline">Request Quote</span>
      <span className="sm:hidden">RFQ</span>
      {totalItemsCount > 0 && (
        <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-[#FAF8F5] text-[#1C1917] rounded-[3px]">
          {totalItemsCount}
        </span>
      )}
    </Link>
  );
};
