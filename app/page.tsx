import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/services/categoryService';
import { getFeaturedProducts } from '@/lib/services/productService';
import { getCollections } from '@/lib/services/collectionService';
import { CategoryGrid } from '@/components/catalog/CategoryGrid';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { CollectionCard } from '@/components/catalog/CollectionCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FinishPalette } from '@/components/ui/FinishPalette';
import { ArrowRight, ShieldCheck, Layers, Sparkles, PackageCheck, Headphones, Globe2, FileText, Hammer } from 'lucide-react';

export const revalidate = 3600;

export default async function HomePage() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();
  const collections = await getCollections();

  return (
    <div className="space-y-24 pb-20 font-sans">
      
      {/* GRAND EDITORIAL HERO SECTION (Prepared for Future Background Video) */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-brand-dark text-white overflow-hidden">
        {/* Background Image / Future Video Player Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1920&auto=format&fit=crop"
            alt="Radience Hand-Cast Architectural Hardware Framework"
            fill
            priority
            className="object-cover object-center opacity-35 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-brand-dark/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/80" />
        </div>

        {/* Ambient Gold & Bronze Flares */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-brass/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Centered Editorial Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-glass text-brand-brass-light rounded-full backdrop-blur-md border border-brand-brass/25 mx-auto">
            <Hammer className="w-4 h-4 text-brand-brass" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] font-sans">
              Hand-Cast Metal Architectural Hardware
            </span>
          </div>

          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-white max-w-4xl mx-auto"
            style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif" }}
          >
            Architectural Hardware Crafted for <span className="gold-text-gradient italic">Distinctive Spaces</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto font-sans">
            Premium door, window, cabinet, decorative and architectural hardware for distributors, designers, builders and global buyers. Inspired by antique details, vintage metalwork, and classical craftsmanship.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-gold-gradient hover:opacity-95 text-brand-dark font-display text-xs font-bold uppercase tracking-[0.18em] rounded shadow-gold transition-all duration-300"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/request-quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-white/5 hover:bg-white/10 text-white font-display text-xs font-bold uppercase tracking-[0.18em] rounded border border-white/15 backdrop-blur-md transition-all duration-300"
            >
              <FileText className="w-4 h-4 text-brand-brass" />
              <span>Request a Quote</span>
            </Link>
          </div>

          {/* Heritage Metal Metadata Bar */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-800/80 text-xs text-slate-400 font-sans max-w-3xl mx-auto">
            <div className="space-y-1">
              <p className="font-bold text-white font-serif text-lg" style={{ fontFamily: "var(--font-serif), serif" }}>
                Cast Metal Alloys
              </p>
              <p className="text-[11px] text-slate-400 font-light">Solid Brass, Iron & Cast Bronze</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-white font-serif text-lg" style={{ fontFamily: "var(--font-serif), serif" }}>
                Antique Patterns
              </p>
              <p className="text-[11px] text-slate-400 font-light">Victorian & Traditional Replicas</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-white font-serif text-lg" style={{ fontFamily: "var(--font-serif), serif" }}>
                Hand Patinas
              </p>
              <p className="text-[11px] text-slate-400 font-light">Aged Brass & Forged Black</p>
            </div>
          </div>

        </div>
      </section>

      {/* VISUAL CATEGORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Hardware Range"
          title="Explore Product Categories"
          description="Hand-cast brass, iron, bronze, and steel hardware inspired by historic architectural patterns and classical interior design."
          centered
        />
        <CategoryGrid categories={categories} />
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="bg-white py-20 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeading
              subtitle="Radience Handcrafted Range"
              title="Featured Architectural Hardware"
              description="Select high-demand cast handles, mortise knobs, window stays, shelf brackets, and decorative metalwork."
            />
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-brass hover:text-brand-brass-dark transition-colors self-start md:self-auto font-sans"
            >
              <span>View Entire Catalog ({featuredProducts.length}+)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* INTERACTIVE FINISH PALETTE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FinishPalette />
      </section>

      {/* ARCHITECTURAL COLLECTIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeading
          subtitle="Heritage Themes"
          title="Curated Hardware Collections"
          description="Explore styled metal hardware series taking inspiration from Victorian, Tudor, Gothic, Nautical, and natural organic forms."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.slice(0, 3).map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </section>

      {/* WHY US - CRAFTSMANSHIP & B2B TRUST SECTION */}
      <section className="bg-brand-dark text-white py-20 border-t border-brand-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeading
            subtitle="Metalwork & B2B Wholesale"
            title="Why Leading Distributors & Architects Choose Radience"
            description="Our metal casting workflow and wholesale trade services are tailored specifically for hardware stockists, restoration architects, and global buyers."
            centered
            lightMode
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-brand-card rounded-xl border border-brand-border-dark space-y-4 shadow-card hover:border-brand-brass/40 transition-colors">
              <div className="p-3 bg-brand-brass/10 text-brand-brass rounded-lg w-fit">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-serif), serif" }}>
                Cast Metal Quality
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                High-grade brass, forged iron, and cast bronze. Every piece is hand-trimmed and patinated for authentic metal depth and tactile feel.
              </p>
            </div>

            <div className="p-8 bg-brand-card rounded-xl border border-brand-border-dark space-y-4 shadow-card hover:border-brand-brass/40 transition-colors">
              <div className="p-3 bg-brand-brass/10 text-brand-brass rounded-lg w-fit">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-serif), serif" }}>
                Extensive Range
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Over 12 core product categories encompassing door handles, rim locks, letter plates, cabinet pulls, shelf brackets, and saddlery fittings.
              </p>
            </div>

            <div className="p-8 bg-brand-card rounded-xl border border-brand-border-dark space-y-4 shadow-card hover:border-brand-brass/40 transition-colors">
              <div className="p-3 bg-brand-brass/10 text-brand-brass rounded-lg w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-serif), serif" }}>
                Traditional Metal Finishes
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Hand-applied patinas and metal coatings, including Antique Brass, Aged Copper, Oil Rubbed Bronze, and Rust-Armour Black Iron.
              </p>
            </div>

            <div className="p-8 bg-brand-card rounded-xl border border-brand-border-dark space-y-4 shadow-card hover:border-brand-brass/40 transition-colors">
              <div className="p-3 bg-brand-brass/10 text-brand-brass rounded-lg w-fit">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-serif), serif" }}>
                Bulk & Wholesale Shipments
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Scalable manufacturing accommodating bulk trade orders, distributor stock shipments, and customized hardware packaging.
              </p>
            </div>

            <div className="p-8 bg-brand-card rounded-xl border border-brand-border-dark space-y-4 shadow-card hover:border-brand-brass/40 transition-colors">
              <div className="p-3 bg-brand-brass/10 text-brand-brass rounded-lg w-fit">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-serif), serif" }}>
                B2B Trade Support
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Dedicated trade desk assisting distributors, specifiers, and builders with hardware estimations and RFQ quotations.
              </p>
            </div>

            <div className="p-8 bg-brand-card rounded-xl border border-brand-border-dark space-y-4 shadow-card hover:border-brand-brass/40 transition-colors">
              <div className="p-3 bg-brand-brass/10 text-brand-brass rounded-lg w-fit">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-serif), serif" }}>
                Global Export Supply
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Supplying international B2B importers, hardware retailers, and contractors across Europe, North America, Middle East, and worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL QUOTE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gold-gradient rounded-xl p-8 sm:p-14 text-brand-dark shadow-floating flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10">
            <span className="text-xs font-semibold uppercase tracking-widest font-sans text-brand-dark/80">
              Radience B2B Wholesale Enquiry
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight uppercase"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Ready to Request Direct Factory Quotations?
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/90 font-light max-w-xl">
              Select products for your Quote List and submit a single RFQ enquiry. Our trade team will respond with volume pricing.
            </p>
          </div>
          <Link
            href="/request-quote"
            className="px-8 py-4 bg-brand-dark hover:bg-black text-white font-display text-xs font-bold uppercase tracking-widest rounded shadow-lg transition-all flex-shrink-0 relative z-10"
          >
            Request a Quote Now
          </Link>
        </div>
      </section>

    </div>
  );
}
