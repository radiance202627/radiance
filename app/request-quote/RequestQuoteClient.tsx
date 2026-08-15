'use client';

import React from 'react';
import Link from 'next/link';
import { useQuote } from '@/context/QuoteContext';
import { RequestQuoteForm } from '@/components/quote/RequestQuoteForm';
import { EmptyQuote } from '@/components/quote/EmptyQuote';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FileText, Package, ArrowLeft } from 'lucide-react';

export const RequestQuoteClient: React.FC = () => {
  const { items } = useQuote();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        <Breadcrumbs items={[{ label: 'Request a Quote' }]} />
        <EmptyQuote />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <Breadcrumbs items={[{ label: 'Quote List', href: '/quote' }, { label: 'Submit RFQ Enquiry' }]} />

      {/* Header Banner */}
      <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-6 sm:p-8 shadow-sm">
        <SectionHeading
          subtitle="Direct Factory Quotation"
          title="Submit Request For Quote (RFQ)"
          description="Complete the business enquiry form below to receive wholesale pricing, lead times, and shipping estimates for your selected architectural hardware items."
        />
      </div>

      {/* Products Summary Card at Top */}
      <div className="bg-[#F4F2ED] text-[#222222] rounded-2xl p-6 shadow-sm border border-[#E5E2DA] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#B08D57]" />
            <h3 className="font-display font-bold text-base uppercase tracking-wider text-[#222222]">
              Selected Products ({items.length} Items)
            </h3>
          </div>
          <Link
            href="/quote"
            className="text-xs text-[#B08D57] hover:text-[#9A7B4B] underline flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Edit Items
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E2DA] flex items-center justify-between gap-2"
            >
              <div className="truncate">
                <p className="font-display font-semibold text-[#222222] truncate">{item.product.name}</p>
                <p className="text-[11px] text-[#666666] font-mono">
                  {item.product.sku} • {item.selectedFinish} • {item.selectedSize}
                </p>
              </div>
              <span className="bg-[#B08D57]/15 text-[#B08D57] font-bold px-2 py-1 rounded-md text-xs border border-[#B08D57]/20">
                Qty: {item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Enquiry Form Component */}
      <RequestQuoteForm />

    </div>
  );
};
