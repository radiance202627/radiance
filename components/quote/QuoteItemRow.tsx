'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { QuoteItem } from '@/lib/types';
import { useQuote } from '@/context/QuoteContext';
import { QuantitySelector } from '@/components/product-detail/QuantitySelector';
import { Trash2 } from 'lucide-react';

interface QuoteItemRowProps {
  item: QuoteItem;
}

export const QuoteItemRow: React.FC<QuoteItemRowProps> = ({ item }) => {
  const { removeItem, updateQuantity } = useQuote();

  return (
    <div className="bg-white rounded border border-brand-border p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
      
      {/* Product Thumbnail & Details */}
      <div className="flex items-start gap-4 flex-1">
        <div className="relative w-20 h-20 bg-brand-slate rounded border border-slate-200 overflow-hidden flex-shrink-0">
          <Image
            src={item.product.images[0] || 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=300&auto=format&fit=crop'}
            alt={item.product.name}
            fill
            sizes="80px"
            className="object-cover object-center"
          />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-500 font-semibold block">
            SKU: {item.product.sku}
          </span>
          <h4 className="font-display font-semibold text-brand-dark text-sm hover:text-brand-brass transition-colors">
            <Link href={`/product/${item.product.slug}`}>
              {item.product.name}
            </Link>
          </h4>

          {/* Selected Variant Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
              Finish: <strong className="text-brand-dark">{item.selectedFinish}</strong>
            </span>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
              Size: <strong className="text-brand-dark">{item.selectedSize}</strong>
            </span>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
              Material: <strong className="text-brand-dark">{item.selectedMaterial}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Quantity & Delete Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
        <QuantitySelector
          quantity={item.quantity}
          onChange={(newQty) => updateQuantity(item.id, newQty)}
        />

        <button
          onClick={() => removeItem(item.id)}
          className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
          title="Remove from quote"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
