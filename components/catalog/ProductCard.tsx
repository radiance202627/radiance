'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useQuote } from '@/context/QuoteContext';
import { Plus, Eye, CheckCircle, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useQuote();
  const [selectedFinish, setSelectedFinish] = useState(product.finishes[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, selectedFinish, selectedSize, product.material, 1);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const getFinishColorSwatch = (finishName: string) => {
    const f = finishName.toLowerCase();
    if (f.includes('brass') || f.includes('gold')) return 'bg-[#d97706] border-[#f59e0b]';
    if (f.includes('chrome') || f.includes('nickel') || f.includes('stainless')) return 'bg-stone-300 border-stone-100';
    if (f.includes('black')) return 'bg-stone-900 border-stone-700';
    if (f.includes('bronze') || f.includes('copper')) return 'bg-amber-900 border-amber-700';
    return 'bg-amber-600 border-amber-400';
  };

  return (
    <div className="group bg-[#F4F2ED] border border-[#E5E2DA] hover:border-[#B08D57]/40 rounded-2xl shadow-sm transition-all duration-500 flex flex-col h-full overflow-hidden font-sans relative">
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] bg-[#FAF9F6] overflow-hidden p-4 flex items-center justify-center border-b border-[#E5E2DA]">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#666666] bg-[#F4F2ED]/90 px-2.5 py-1 rounded-md border border-[#E5E2DA] backdrop-blur-sm">
            {product.subcategoryName}
          </span>
        </div>

        <span className="absolute top-3 right-3 z-10 font-mono text-[10px] font-semibold text-[#B08D57] bg-[#F4F2ED]/90 px-2 py-0.5 rounded-md border border-[#E5E2DA] backdrop-blur-sm">
          {product.sku}
        </span>

        <Link href={`/product/${product.slug}`} className="block w-full h-full relative group">
          <Image
            src={product.images[0] || 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=600&auto=format&fit=crop'}
            alt={`${product.name} - ${product.material} ${selectedFinish || product.finishes[0] || ''} ${product.subcategoryName} Fitting`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center img-luxury-zoom"
          />
        </Link>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-[#666666] mb-1.5">
            <span className="text-[11px] font-medium text-[#B08D57] font-sans flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#B08D57]" /> {product.material}
            </span>
          </div>

          <h3 className="font-serif font-bold text-[#222222] text-lg sm:text-xl leading-snug group-hover:text-[#B08D57] transition-colors line-clamp-2">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>

          <p className="text-xs text-[#666666] mt-2 line-clamp-2 leading-relaxed font-normal">
            {product.shortDescription}
          </p>
        </div>

        {/* Finish Swatches & Size Selection Bar */}
        <div className="pt-3 border-t border-[#E5E2DA] space-y-2 text-xs">
          {product.finishes.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-[#666666] uppercase tracking-wider font-semibold">
                <span>Finish:</span>
                <span className="text-[#222222] font-medium">{selectedFinish}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.finishes.map((f) => {
                  const isSel = selectedFinish === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFinish(f)}
                      title={f}
                      className={`w-4 h-4 rounded-full border transition-all ${getFinishColorSwatch(f)} ${
                        isSel ? 'scale-110 ring-2 ring-[#B08D57] ring-offset-1 ring-offset-[#F4F2ED]' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-[10px] text-[#666666] uppercase tracking-wider font-semibold">Size:</span>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="text-[11px] bg-[#FAF9F6] border border-[#E5E2DA] text-[#222222] rounded-[8px] px-2 py-1 focus:outline-none focus:border-[#B08D57] font-medium"
              >
                {product.sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action CTAs */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#FAF9F6] hover:bg-[#E5E2DA] text-[#222222] text-xs font-sans font-medium rounded-[8px] border border-[#E5E2DA] transition-colors text-center"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>

          <button
            onClick={handleAddToQuote}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-sans font-medium rounded-[8px] transition-colors duration-200 ${
              isAdded
                ? 'bg-emerald-600 text-[#FAF9F6]'
                : 'bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6]'
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>+ Quote</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
