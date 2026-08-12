'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useQuote } from '@/context/QuoteContext';
import { ProductGallery } from '@/components/product-detail/ProductGallery';
import { VariantSelector } from '@/components/product-detail/VariantSelector';
import { QuantitySelector } from '@/components/product-detail/QuantitySelector';
import { ProductSpecifications } from '@/components/product-detail/ProductSpecifications';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Plus, CheckCircle, MessageSquare, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  relatedProducts,
}) => {
  const { addItem } = useQuote();
  const [selectedFinish, setSelectedFinish] = useState(product.finishes[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToQuote = () => {
    addItem(product, selectedFinish, selectedSize, product.material, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products' },
          { label: product.categoryName, href: `/products/${product.categorySlug}` },
          { label: product.subcategoryName, href: `/products/${product.categorySlug}/${product.subcategorySlug}` },
          { label: product.sku },
        ]}
      />

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Product Specs, Variants, CTAs */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-brand-border p-6 sm:p-8 shadow-card space-y-6">
          
          {/* Header & Identifiers */}
          <div className="space-y-2 pb-4 border-b border-slate-200">
            <div className="flex items-center justify-between text-xs text-brand-text-muted">
              <span className="font-mono text-slate-500 font-semibold">SKU: {product.sku}</span>
              <span className="bg-brand-slate text-brand-dark px-2.5 py-1 rounded font-medium border border-slate-200">
                {product.categoryName} • {product.subcategoryName}
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-dark tracking-tight leading-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Variant Selector (Finish & Size) */}
          <VariantSelector
            finishes={product.finishes}
            selectedFinish={selectedFinish}
            onSelectFinish={setSelectedFinish}
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            material={product.material}
          />

          {/* Quantity Selector */}
          <QuantitySelector quantity={quantity} onChange={setQuantity} />

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToQuote}
              className={`w-full py-4 font-display text-sm font-bold uppercase tracking-widest rounded shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-brass hover:bg-brand-brass-dark text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Added to Quote List!</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add To Quote</span>
                </>
              )}
            </button>

            <Link
              href="/contact"
              className="w-full py-3 bg-brand-slate hover:bg-slate-200 text-brand-dark font-display text-xs font-semibold uppercase tracking-wider rounded border border-slate-300 transition-colors flex items-center justify-center gap-2 text-center"
            >
              <MessageSquare className="w-4 h-4 text-brand-brass" />
              <span>Ask About Custom Engineering / Wholesale Enquiries</span>
            </Link>
          </div>

          {/* Trade Trust Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-sans text-center">
            <div className="space-y-1">
              <ShieldCheck className="w-4 h-4 text-brand-brass mx-auto" />
              <p className="font-semibold text-brand-dark">Solid Cast Alloy</p>
              <p className="text-[10px] text-slate-400">EN 1906 Standard</p>
            </div>
            <div className="space-y-1">
              <Truck className="w-4 h-4 text-brand-brass mx-auto" />
              <p className="font-semibold text-brand-dark">Global Container Shipments</p>
              <p className="text-[10px] text-slate-400">Sea & Air Logistics</p>
            </div>
            <div className="space-y-1">
              <RefreshCw className="w-4 h-4 text-brand-brass mx-auto" />
              <p className="font-semibold text-brand-dark">Sample Dispatch</p>
              <p className="text-[10px] text-slate-400">Upon Architect Request</p>
            </div>
          </div>

        </div>
      </div>

      {/* Technical Specifications Section */}
      <ProductSpecifications
        sku={product.sku}
        name={product.name}
        material={product.material}
        specifications={product.specifications}
      />

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-brand-dark uppercase tracking-wider">
              Related Hardware Fittings
            </h3>
            <Link
              href={`/products/${product.categorySlug}`}
              className="text-xs font-display font-semibold uppercase tracking-wider text-brand-brass hover:text-brand-brass-dark"
            >
              View Category
            </Link>
          </div>
          <ProductGrid products={relatedProducts} />
        </div>
      )}

    </div>
  );
};
