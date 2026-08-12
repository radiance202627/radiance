'use client';

import React from 'react';
import Link from 'next/link';
import { useQuote } from '@/context/QuoteContext';
import { QuoteItemRow } from '@/components/quote/QuoteItemRow';
import { EmptyQuote } from '@/components/quote/EmptyQuote';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FileText, ArrowRight, Trash2, ArrowLeft } from 'lucide-react';

export const QuoteClient: React.FC = () => {
  const { items, clearQuote, totalItemsCount } = useQuote();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        <Breadcrumbs items={[{ label: 'Quote List' }]} />
        <EmptyQuote />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <Breadcrumbs items={[{ label: 'Quote List' }]} />

      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-brand-border p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SectionHeading
          subtitle="Selected Hardware Items"
          title="Your Quote List"
          description={`Review your selected architectural products (${totalItemsCount} items) before submitting an official B2B Enquiry.`}
        />

        <button
          onClick={clearQuote}
          className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1.5 transition-colors self-end sm:self-auto"
        >
          <Trash2 className="w-4 h-4" /> Clear Quote List
        </button>
      </div>

      {/* Quote Items List Container */}
      <div className="space-y-4">
        {items.map((item) => (
          <QuoteItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* Summary Action Bar */}
      <div className="bg-brand-charcoal text-white rounded-lg p-6 sm:p-8 shadow-floating flex flex-col sm:flex-row items-center justify-between gap-6 border border-brand-border-dark">
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-display font-bold text-lg text-white">
            Ready to Submit Your Official RFQ?
          </p>
          <p className="text-xs text-slate-300 font-light">
            Proceeding to the next step allows you to provide company details, required lead times, and custom packaging instructions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-display text-xs font-semibold uppercase tracking-wider rounded backdrop-blur-sm transition-colors text-center flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Browsing
          </Link>

          <Link
            href="/request-quote"
            className="w-full sm:w-auto px-8 py-3 bg-brand-brass hover:bg-brand-brass-dark text-white font-display text-xs font-bold uppercase tracking-widest rounded shadow transition-all text-center flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" /> Request a Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
