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
      className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] font-sans text-xs font-medium uppercase tracking-wider rounded-[8px] transition-colors duration-200"
    >
      <FileText className="w-3.5 h-3.5" />
      <span>Request a Quote</span>
      {totalItemsCount > 0 && (
        <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold bg-[#FAF9F6] text-[#222222] rounded-full">
          {totalItemsCount}
        </span>
      )}
    </Link>
  );
};
