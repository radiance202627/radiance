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
    if (f.includes('brass') || f.includes('gold')) return 'bg-[#c59b27] border-[#e5c365]';
    if (f.includes('chrome') || f.includes('nickel') || f.includes('stainless')) return 'bg-slate-300 border-slate-100';
    if (f.includes('black')) return 'bg-slate-900 border-slate-700';
    if (f.includes('bronze') || f.includes('copper')) return 'bg-amber-900 border-amber-700';
    return 'bg-amber-600 border-amber-400';
  };

  return (
    <div className="group bg-white rounded-lg border border-brand-border/80 hover:border-brand-brass/50 shadow-card hover:shadow-floating transition-all duration-500 flex flex-col h-full overflow-hidden font-sans relative">
      
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] bg-brand-slate overflow-hidden p-4 flex items-center justify-center">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-dark bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-200 shadow-sm font-sans">
            {product.subcategoryName}
          </span>
        </div>

        <span className="absolute top-3 right-3 z-10 font-mono text-[10px] font-semibold text-brand-brass bg-brand-dark/90 text-amber-100 px-2 py-0.5 rounded border border-brand-brass/30 backdrop-blur-sm">
          {product.sku}
        </span>

        <Link href={`/product/${product.slug}`} className="block w-full h-full relative group">
          <Image
            src={product.images[0] || 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=600&auto=format&fit=crop'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-brand-text-muted mb-1.5">
            <span className="text-[11px] font-medium text-brand-brass font-sans flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-brass" /> {product.material}
            </span>
          </div>

          <h3 className="font-bold text-brand-dark text-lg sm:text-xl leading-snug group-hover:text-brand-brass transition-colors line-clamp-2"
              style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif" }}>
            <Link href={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          <p className="text-xs text-brand-text-muted mt-2 line-clamp-2 leading-relaxed font-light">
            {product.shortDescription}
          </p>
        </div>

        {/* Finish Swatches & Size Selection Bar */}
        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
          {product.finishes.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                <span>Finish:</span>
                <span className="text-brand-dark font-medium">{selectedFinish}</span>
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
                      className={`w-5 h-5 rounded-full border-2 transition-all ${getFinishColorSwatch(f)} ${
                        isSel ? 'scale-110 shadow-sm ring-2 ring-brand-brass ring-offset-1' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Size:</span>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="text-[11px] bg-slate-50 border border-slate-200 text-brand-dark rounded px-2 py-0.5 focus:outline-none focus:border-brand-brass font-medium"
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
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-brand-slate hover:bg-slate-200 text-brand-dark text-xs font-semibold rounded border border-slate-200 transition-colors text-center"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>

          <button
            onClick={handleAddToQuote}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 font-display text-xs font-semibold uppercase tracking-wider rounded transition-all duration-300 ${
              isAdded
                ? 'bg-emerald-700 text-white shadow'
                : 'bg-gradient-to-r from-brand-brass to-brand-brass-dark hover:from-brand-brass-dark hover:to-brand-dark text-white shadow-sm hover:shadow-md'
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
