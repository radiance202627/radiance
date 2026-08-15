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
    <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
      
      {/* Product Thumbnail & Details */}
      <div className="flex items-start gap-4 flex-1">
        <div className="relative w-20 h-20 bg-[#FAF9F6] rounded-xl border border-[#E5E2DA] overflow-hidden flex-shrink-0">
          <Image
            src={item.product.images[0] || 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=300&auto=format&fit=crop'}
            alt={item.product.name}
            fill
            sizes="80px"
            className="object-cover object-center"
          />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[#666666] font-semibold block">
            SKU: {item.product.sku}
          </span>
          <h4 className="font-display font-semibold text-[#222222] text-sm hover:text-[#B08D57] transition-colors">
            <Link href={`/product/${item.product.slug}`}>
              {item.product.name}
            </Link>
          </h4>

          {/* Selected Variant Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] bg-[#FAF9F6] text-[#666666] px-2 py-0.5 rounded-md border border-[#E5E2DA]">
              Finish: <strong className="text-[#222222]">{item.selectedFinish}</strong>
            </span>
            <span className="text-[11px] bg-[#FAF9F6] text-[#666666] px-2 py-0.5 rounded-md border border-[#E5E2DA]">
              Size: <strong className="text-[#222222]">{item.selectedSize}</strong>
            </span>
            <span className="text-[11px] bg-[#FAF9F6] text-[#666666] px-2 py-0.5 rounded-md border border-[#E5E2DA]">
              Material: <strong className="text-[#222222]">{item.selectedMaterial}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Quantity & Delete Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E5E2DA]">
        <QuantitySelector
          quantity={item.quantity}
          onChange={(newQty) => updateQuantity(item.id, newQty)}
        />

        <button
          onClick={() => removeItem(item.id)}
          className="p-2 text-[#666666] hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
          title="Remove from quote"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
