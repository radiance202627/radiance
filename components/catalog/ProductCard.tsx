'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useQuote } from '@/context/QuoteContext';
import { Plus, Eye, CheckCircle } from 'lucide-react';

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
    if (f.includes('brass') || f.includes('gold')) return 'bg-[#9E7B47] border-[#856637]';
    if (f.includes('chrome') || f.includes('nickel') || f.includes('stainless')) return 'bg-[#D9D3C7] border-[#C2BAAA]';
    if (f.includes('black')) return 'bg-[#1C1917] border-[#292524]';
    if (f.includes('bronze') || f.includes('copper')) return 'bg-[#5C4528] border-[#42311C]';
    return 'bg-[#9E7B47] border-[#7C6035]';
  };

  return (
    <div className="group bg-[#F3F0E8] border border-[#E6E1D7] hover:border-[#9E7B47]/40 rounded-[6px] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col h-full overflow-hidden font-sans relative">
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] bg-[#FAF8F5] overflow-hidden p-4 flex items-center justify-center border-b border-[#E6E1D7]">
        {/* Subcategory & SKU Badges */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6B635B] bg-[#FAF8F5]/90 px-2.5 py-1 rounded-[3px] border border-[#E6E1D7]">
            {product.subcategoryName}
          </span>
        </div>

        <span className="absolute top-3 right-3 z-10 font-mono text-[9px] font-medium text-[#9E7B47] bg-[#FAF8F5]/90 px-2 py-0.5 rounded-[3px] border border-[#E6E1D7]">
          {product.sku}
        </span>

        <Link href={`/product/${product.slug}`} className="block w-full h-full relative group">
          <Image
            src={product.images[0] || 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=600&auto=format&fit=crop'}
            alt={`${product.name} - ${product.material} ${selectedFinish || product.finishes[0] || ''}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center img-luxury-zoom"
          />
        </Link>
      </div>

      {/* Product Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-[#6B635B] mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9E7B47]">
              {product.material}
            </span>
          </div>

          <h3 className="font-serif font-medium text-[#1C1917] text-lg sm:text-xl leading-snug group-hover:text-[#9E7B47] transition-colors line-clamp-2">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>

          <p className="text-xs text-[#6B635B] mt-2 line-clamp-2 leading-relaxed font-normal">
            {product.shortDescription}
          </p>
        </div>

        {/* Finish Swatches & Size Bar */}
        <div className="pt-3 border-t border-[#E6E1D7] space-y-2 text-xs">
          {product.finishes.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-[#6B635B] uppercase tracking-wider font-semibold">
                <span>Finish:</span>
                <span className="text-[#1C1917] font-medium">{selectedFinish}</span>
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
                      className={`w-3.5 h-3.5 rounded-full border transition-all ${getFinishColorSwatch(f)} ${
                        isSel ? 'scale-110 ring-2 ring-[#9E7B47] ring-offset-1 ring-offset-[#F3F0E8]' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-[10px] text-[#6B635B] uppercase tracking-wider font-semibold">Size:</span>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                aria-label={`Select size for ${product.name}`}
                className="text-[11px] bg-[#FAF8F5] border border-[#E6E1D7] text-[#1C1917] rounded-[4px] px-2 py-1 focus:outline-none focus:border-[#9E7B47] font-medium"
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

        {/* Understated Action CTAs */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#FAF8F5] hover:bg-[#EAE5DB] text-[#1C1917] text-[11px] font-semibold uppercase tracking-[0.16em] rounded-[4px] border border-[#E6E1D7] transition-colors text-center"
          >
            <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Details</span>
          </Link>

          <button
            onClick={handleAddToQuote}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] rounded-[4px] transition-all duration-500 ${
              isAdded
                ? 'bg-[#43593A] text-[#FAF8F5]'
                : 'bg-[#9E7B47] hover:bg-[#856637] text-[#FAF8F5]'
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>+ Quote</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
