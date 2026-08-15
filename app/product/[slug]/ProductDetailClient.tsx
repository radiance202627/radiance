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
        <div className="lg:col-span-6 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Header & Identifiers */}
          <div className="space-y-2 pb-4 border-b border-[#E5E2DA]">
            <div className="flex items-center justify-between text-xs text-[#666666]">
              <span className="font-mono text-[#666666] font-semibold">SKU: {product.sku}</span>
              <span className="bg-[#FAF9F6] text-[#222222] px-2.5 py-1 rounded-md font-medium border border-[#E5E2DA]">
                {product.categoryName} • {product.subcategoryName}
              </span>
            </div>

            <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#222222] tracking-tight leading-snug">
              {product.name}
            </h1>

            <p className="text-sm text-[#666666] leading-relaxed font-sans font-normal max-w-prose">
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
              className={`w-full py-3.5 px-6 font-sans text-xs font-medium uppercase tracking-widest rounded-[8px] transition-colors duration-200 flex items-center justify-center gap-2 ${
                isAdded
                  ? 'bg-emerald-600 text-[#FAF9F6]'
                  : 'bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6]'
              }`}
            >
              {isAdded ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Added to Quote List!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add To Quote</span>
                </>
              )}
            </button>

            <Link
              href="/contact"
              className="w-full py-3 px-6 bg-[#FAF9F6] hover:bg-[#E5E2DA] text-[#222222] font-sans text-xs font-medium uppercase tracking-wider rounded-[8px] border border-[#E5E2DA] transition-colors flex items-center justify-center gap-2 text-center"
            >
              <MessageSquare className="w-4 h-4 text-[#B08D57]" />
              <span>Ask About Custom Engineering / Wholesale Enquiries</span>
            </Link>
          </div>

          {/* Trade Trust Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E5E2DA] text-[11px] text-[#666666] font-sans text-center">
            <div className="space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#B08D57] mx-auto" />
              <p className="font-semibold text-[#222222]">Solid Cast Alloy</p>
              <p className="text-[10px] text-[#666666]">EN 1906 Standard</p>
            </div>
            <div className="space-y-1">
              <Truck className="w-4 h-4 text-[#B08D57] mx-auto" />
              <p className="font-semibold text-[#222222]">Global Container Shipments</p>
              <p className="text-[10px] text-[#666666]">Sea & Air Logistics</p>
            </div>
            <div className="space-y-1">
              <RefreshCw className="w-4 h-4 text-[#B08D57] mx-auto" />
              <p className="font-semibold text-[#222222]">Sample Dispatch</p>
              <p className="text-[10px] text-[#666666]">Upon Architect Request</p>
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

      {/* COMPREHENSIVE ARCHITECTURAL & PRODUCT SPECIFICATION GUIDE */}
      <section className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-6 sm:p-10 space-y-8 font-sans">
        <div className="border-b border-[#E5E2DA] pb-4 space-y-1">
          <span className="text-xs font-sans font-medium uppercase tracking-widest text-[#B08D57]">
            Manufacturing & Architectural Specification Guide
          </span>
          <h2 className="font-serif font-bold text-2xl text-[#222222]">
            {product.name} Technical Guide & Applications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#666666] leading-relaxed">
          {/* Architectural Applications & Suitability */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#222222]">
              Architectural Applications & Project Suitability
            </h3>
            <p>
              The {product.name} (SKU: {product.sku}) is engineered specifically for high-traffic commercial portals, luxury residential entry doors, boutique hospitality suites, and heritage timber restorations. Cast and forged from virgin {product.material} in Aligarh, India, it integrates with standard European DIN and British lockcase standards.
            </p>
            <p>
              Its substantial wall thickness and ergonomic grip profile make it an ideal specification for high-end interior designers, architectural ironmongers, and commercial project contractors.
            </p>
          </div>

          {/* Metallurgical Integrity & Finish Engineering */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#222222]">
              Metallurgical Alloy & Surface Finish Engineering
            </h3>
            <p>
              Manufactured from virgin CuZn39Pb2 brass ingot free from recycled metal impurities. Available in {product.finishes.join(', ')}. Each finish undergoes multi-stage hand linishing, chemical patination, and clear baked electro-lacquering or PVD coating tested to ISO 9227 neutral salt spray standards.
            </p>
          </div>

          {/* Step-by-Step Installation Guide */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#222222]">
              Installation & Mounting Specifications
            </h3>
            <p>
              Supplied with color-matched solid brass wood screws, sex-bolt sleeve anchors, and an Allen key. Pre-drill pilot holes using a 2.5mm bit for timber substrates. Insert the included 8mm steel square spindle through the mortise lock latch hub, attach rose plates, and tighten set screws onto the spindle recess for anti-sag operation.
            </p>
          </div>

          {/* Care & Maintenance Instructions */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#222222]">
              Care, Maintenance & Export Logistics
            </h3>
            <p>
              Clean periodically with a soft cloth dampened with warm water and mild soap. Avoid abrasive metal polishes or acid-based cleaners which compromise protective lacquers. For global export, items are individually boxed, packed into 7-ply master export cartons, and shipped FCL/LCL via Nhava Sheva (JNPT) or Mundra ports.
            </p>
          </div>
        </div>

        {/* OEM Tooling CTA */}
        <div className="p-4 bg-[#FAF9F6] rounded-[8px] border border-[#E5E2DA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5">
            <strong className="font-serif text-[#222222] block">Require OEM Custom Tooling or Private Label Packaging?</strong>
            <span className="text-[#666666]">Radiance offers custom CTC backset milling, laser logo etching, and bespoke packaging for bulk buyers.</span>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] font-sans text-xs font-medium uppercase tracking-wider rounded-[8px] whitespace-nowrap transition-colors"
          >
            Contact Export Desk
          </Link>
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-[#E5E2DA]">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl text-[#222222] tracking-tight">
              Related Hardware Fittings
            </h3>
            <Link
              href={`/products/${product.categorySlug}`}
              className="text-xs font-sans font-medium uppercase tracking-wider text-[#B08D57] hover:text-[#9A7B4B]"
            >
              View Full Category
            </Link>
          </div>
          <ProductGrid products={relatedProducts} />
        </div>
      )}

    </div>
  );
};
