import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';

export const EmptyQuote: React.FC = () => {
  return (
    <div className="py-20 text-center bg-white rounded-lg border border-brand-border p-8 max-w-xl mx-auto shadow-sm my-12">
      <div className="w-16 h-16 bg-brand-slate text-brand-brass rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
        <FileText className="w-8 h-8" />
      </div>
      <h2 className="font-display font-bold text-2xl text-brand-dark mb-2">
        Your quote list is empty.
      </h2>
      <p className="text-sm text-brand-text-muted mb-8 leading-relaxed">
        Browse our architectural hardware collection and add products you&apos;re interested in receiving direct factory wholesale quotes for.
      </p>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-brass hover:bg-brand-brass-dark text-white font-display text-xs font-semibold uppercase tracking-wider rounded shadow transition-all"
      >
        <span>Explore Products</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
