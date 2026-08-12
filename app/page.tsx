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

  const whyUsItems = [
    {
      num: '01',
      icon: Hammer,
      title: 'Cast Metal Quality',
      desc: 'High-grade solid brass, forged iron, and cast bronze. Every piece is hand-trimmed and patinated for authentic depth.',
    },
    {
      num: '02',
      icon: Layers,
      title: 'Extensive Spec Range',
      desc: 'Over 12 core product categories encompassing door handles, rim locks, letter plates, cabinet pulls, and shelf brackets.',
    },
    {
      num: '03',
      icon: Sparkles,
      title: 'Traditional Hand Patinas',
      desc: 'Hand-applied patinas including Antique Brass, Aged Copper, Oil Rubbed Bronze, and Rust-Armour Black Iron.',
    },
    {
      num: '04',
      icon: PackageCheck,
      title: 'Bulk & Wholesale Shipments',
      desc: 'Scalable manufacturing accommodating bulk trade orders, distributor stock shipments, and customized packaging.',
    },
    {
      num: '05',
      icon: Headphones,
      title: 'B2B Trade Desk Support',
      desc: 'Dedicated technical desk assisting distributors, specifiers, and builders with hardware estimations and RFQ responses.',
    },
    {
      num: '06',
      icon: Globe2,
      title: 'Global Export Supply',
      desc: 'Supplying international B2B importers, hardware retailers, and contractors across Europe, America, and Middle East.',
    },
  ];

  return (
    <div className="space-y-24 pb-20 font-sans bg-stone-950 text-stone-200">
      {/* GRAND EDITORIAL HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-stone-950 text-white overflow-hidden border-b border-stone-800/80">
        {/* Background Image / Texture Frame */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1920&auto=format&fit=crop"
            alt="Radiance Hand-Cast Architectural Hardware Framework"
            fill
            priority
            className="object-cover object-center opacity-25 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/90" />
        </div>

        {/* Ambient Gold Flare */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Centered Editorial Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-900/80 text-amber-400 rounded-md backdrop-blur-md border border-amber-500/30 mx-auto shadow-lg">
            <Hammer className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] font-sans">
              Hand-Cast Metal Architectural Hardware
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.10] text-stone-100 max-w-4xl mx-auto">
            Architectural Hardware Crafted for <span className="text-amber-400 italic font-serif">Distinctive Spaces</span>
          </h1>

          <p className="text-base sm:text-xl text-stone-300 font-normal leading-relaxed max-w-2xl mx-auto font-sans">
            Premium door, window, cabinet, decorative and architectural hardware for distributors, designers, builders and global buyers. Inspired by classical metalwork and heritage craftsmanship.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-sans text-xs font-semibold uppercase tracking-[0.20em] rounded-xl shadow-xl transition-all duration-300"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/request-quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-stone-900/90 hover:bg-stone-800 text-stone-200 font-sans text-xs font-semibold uppercase tracking-[0.20em] rounded-xl border border-stone-700/80 backdrop-blur-md transition-all duration-300 shadow-xl"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Request a Quote</span>
            </Link>
          </div>

          {/* Heritage Metal Metadata Bar */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-stone-800/80 text-xs text-stone-400 font-sans max-w-3xl mx-auto">
            <div className="space-y-1">
              <p className="font-serif font-bold text-stone-100 text-lg">Cast Metal Alloys</p>
              <p className="text-[11px] text-stone-400 font-normal">Solid Brass, Iron & Cast Bronze</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif font-bold text-stone-100 text-lg">Antique Patterns</p>
              <p className="text-[11px] text-stone-400 font-normal">Victorian & Traditional Replicas</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif font-bold text-stone-100 text-lg">Hand Patinas</p>
              <p className="text-[11px] text-stone-400 font-normal">Aged Brass & Forged Black</p>
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
      <section className="bg-stone-950 py-24 border-y border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeading
              subtitle="Radiance Handcrafted Range"
              title="Featured Architectural Hardware"
              description="Select high-demand cast handles, mortise knobs, window stays, shelf brackets, and decorative metalwork."
            />
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors self-start md:self-auto font-sans"
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
      <section className="bg-stone-950 text-stone-100 py-24 border-t border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeading
            subtitle="Metalwork & B2B Wholesale"
            title="Why Leading Distributors & Architects Choose Radiance"
            description="Our metal casting workflow and wholesale trade services are tailored specifically for hardware stockists, restoration architects, and global buyers."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUsItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.num}
                  className="p-8 bg-stone-900/90 rounded-2xl border border-stone-800 border-t-amber-500/30 space-y-4 shadow-2xl hover:border-amber-500/50 transition-all duration-300 relative group"
                >
                  <span className="absolute top-6 right-6 font-serif text-sm font-bold text-stone-600 group-hover:text-amber-400/80 transition-colors">
                    {item.num}
                  </span>
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-stone-950 border border-amber-500/20 text-amber-400">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-100">{item.title}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed font-normal">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL QUOTE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 rounded-2xl p-8 sm:p-14 text-stone-100 shadow-2xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10">
            <span className="text-xs font-semibold uppercase tracking-widest font-sans text-amber-400">
              Radiance B2B Wholesale Enquiry
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
              Ready to Request Direct Factory Quotations?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-normal max-w-xl">
              Select products for your Quote List and submit a single RFQ enquiry. Our trade team will respond with volume pricing.
            </p>
          </div>
          <Link
            href="/request-quote"
            className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-sans text-xs font-semibold uppercase tracking-widest rounded-xl shadow-xl transition-all flex-shrink-0 relative z-10"
          >
            Request a Quote Now
          </Link>
        </div>
      </section>
    </div>
  );
}
