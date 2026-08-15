import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';

export const EmptyQuote: React.FC = () => {
  return (
    <div className="py-20 text-center bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-8 max-w-xl mx-auto shadow-sm my-12 font-sans">
      <div className="w-16 h-16 bg-[#FAF9F6] text-[#B08D57] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E5E2DA]">
        <FileText className="w-8 h-8" />
      </div>
      <h2 className="font-display font-bold text-2xl text-[#222222] mb-2">
        Your quote list is empty.
      </h2>
      <p className="text-sm text-[#666666] mb-8 leading-relaxed">
        Browse our architectural hardware collection and add products you&apos;re interested in receiving direct factory wholesale quotes for.
      </p>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] font-sans text-xs font-medium uppercase tracking-wider rounded-[8px] transition-colors"
      >
        <span>Explore Products</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
