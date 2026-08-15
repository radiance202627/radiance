import React from 'react';
import { Metadata } from 'next';
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
import { JsonLd } from '@/components/seo/JsonLd';
import { generateWebsiteSchema, getCanonicalUrl } from '@/lib/seo/schema';

const canonicalUrl = getCanonicalUrl('/');

export const metadata: Metadata = {
  title: 'Radiance | Handcrafted Solid Brass Architectural Hardware Foundry Exporter',
  description:
    'Direct Indian foundry manufacturer exporting solid brass door handles, mortise knobs, cabinet pulls, window stays, and wrought ironmongery to global specifiers.',
  keywords: [
    'Radiance Architectural Hardware',
    'Brass Hardware Manufacturer India',
    'Aligarh Brass Foundry',
    'Architectural Door Handles Wholesale',
    'Solid Brass Cabinet Pulls Exporter',
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: 'website',
    url: canonicalUrl,
    title: 'Radiance | Handcrafted Solid Brass Architectural Hardware Foundry',
    description:
      'Direct Indian foundry manufacturer exporting solid brass, bronze, and iron architectural hardware worldwide.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radiance | Architectural Hardware Foundry Exporter',
    description:
      'Direct Indian foundry manufacturer exporting solid brass, bronze, and iron architectural hardware worldwide.',
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();
  const collections = await getCollections();
  const websiteSchema = generateWebsiteSchema();

  const whyUsItems = [
    {
      num: '01',
      icon: Hammer,
      title: 'Integrated Brass Foundry',
      desc: 'In-house sand casting, die-casting, and hand-chasing of CuZn39Pb2 virgin brass ingots and forged iron at our Aligarh production facility.',
    },
    {
      num: '02',
      icon: Layers,
      title: 'Architectural Spec Coverage',
      desc: '12 core production divisions spanning mortise locksets, lever handles on rose/plate, friction stays, cabinet pulls, and saddlery fittings.',
    },
    {
      num: '03',
      icon: Sparkles,
      title: 'Hand Patinas & PVD Finishes',
      desc: 'Hand-applied oxidation patinas including Aged Antique Brass, Oil Rubbed Bronze, Satin Chrome, and PVD Titanium Gold coatings.',
    },
    {
      num: '04',
      icon: PackageCheck,
      title: 'OEM Tooling & Private Label',
      desc: 'Custom CAD tooling, laser logo etching, bespoke CTC backsets, and export master carton packaging for international distributors.',
    },
    {
      num: '05',
      icon: ShieldCheck,
      title: 'Metallurgical & Cycle Testing',
      desc: 'Strict quality control incorporating ISO 9227 salt spray chamber testing, micrometer tolerance checks, and 200,000-cycle durability runs.',
    },
    {
      num: '06',
      icon: Globe2,
      title: 'Container Load Shipping',
      desc: 'FCL & LCL container shipping via Nhava Sheva / Mundra ports with complete export documentation, HS code certification, and FOB/CIF terms.',
    },
  ];

  return (
    <div className="space-y-24 pb-20 font-sans bg-[#FAF9F6] text-[#222222]">
      <JsonLd data={websiteSchema} />
      {/* GRAND EDITORIAL HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#FAF9F6] text-[#222222] overflow-hidden border-b border-[#E5E2DA]">
        {/* Background Image / Texture Frame */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1920&auto=format&fit=crop"
            alt="Radiance Hand-Cast Architectural Hardware Framework"
            fill
            priority
            className="object-cover object-center opacity-10 mix-blend-multiply scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/80 to-[#FAF9F6]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-[#FAF9F6]/90" />
        </div>

        {/* Ambient Gold Flare */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#B08D57]/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Centered Editorial Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F4F2ED] text-[#B08D57] rounded-[8px] border border-[#B08D57]/30 mx-auto">
            <Hammer className="w-4 h-4 text-[#B08D57]" />
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.22em]">
              Architectural Brass Foundry & Exporter • Est. 1994
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.10] text-[#222222] max-w-4xl mx-auto">
            Hand-Cast Brass & Hardware Crafted for <span className="text-[#B08D57] italic font-serif">Global Architectural Trade</span>
          </h1>

          <p className="text-base sm:text-lg text-[#666666] font-sans font-normal leading-relaxed max-w-2xl mx-auto">
            Direct factory manufacturer exporting solid brass, bronze, and hand-forged ironmongery. We supply architectural specifiers, commercial builders, hardware stockists, and B2B importers across North America, Europe, and the Middle East.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] font-sans text-xs font-medium uppercase tracking-[0.20em] rounded-[8px] transition-colors duration-200"
            >
              <span>Browse Trade Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/request-quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#F4F2ED] hover:bg-[#E5E2DA] text-[#222222] font-sans text-xs font-medium uppercase tracking-[0.20em] rounded-[8px] border border-[#E5E2DA] transition-colors duration-200"
            >
              <FileText className="w-4 h-4 text-[#B08D57]" />
              <span>Submit RFQ Enquiry</span>
            </Link>
          </div>

          {/* Heritage Metal Metadata Bar */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#E5E2DA] text-xs text-[#666666] font-sans max-w-3xl mx-auto">
            <div className="space-y-1">
              <p className="font-serif font-bold text-[#222222] text-lg">Virgin Brass Alloys</p>
              <p className="text-[11px] text-[#666666] font-normal">CuZn39Pb2 Solid Brass & Sand-Cast Bronze</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif font-bold text-[#222222] text-lg">OEM Tooling & Custom CTC</p>
              <p className="text-[11px] text-[#666666] font-normal">Bespoke Architectural CAD Specifications</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif font-bold text-[#222222] text-lg">Export Compliance</p>
              <p className="text-[11px] text-[#666666] font-normal">BS EN 1906 / ISO 9227 Salt-Spray Tested</p>
            </div>
          </div>
        </div>
      </section>

      {/* VISUAL CATEGORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Foundry Production Categories"
          title="Architectural Hardware Series"
          description="Solid brass lever handles, mortise knobs, casement stays, cabinet pulls, and wrought ironmongery manufactured in our Aligarh foundry units."
          centered
        />
        <CategoryGrid categories={categories} />
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="bg-[#F4F2ED] py-24 border-y border-[#E5E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeading
              subtitle="High-Demand Export Hardware"
              title="Featured Manufacturing Products"
              description="High-volume solid brass door handles, rim latches, friction stays, heavy-duty cabinet pulls, and decorative fittings."
            />
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#B08D57] hover:text-[#9A7B4B] transition-colors self-start md:self-auto font-sans"
            >
              <span>View Full Hardware Range ({featuredProducts.length}+)</span>
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
          subtitle="Historic & Modern Hardware Series"
          title="Curated Architectural Collections"
          description="Designed for period restorations, luxury heritage hotels, classical villas, and contemporary commercial developments."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.slice(0, 3).map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </section>

      {/* WHY US - CRAFTSMANSHIP & B2B TRUST SECTION */}
      <section className="bg-[#FAF9F6] text-[#222222] py-24 border-t border-[#E5E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeading
            subtitle="Direct Factory Capabilities"
            title="Why International Buyers & Specifiers Partner With Radiance"
            description="Our integrated foundry workflows, metallurgical controls, and direct export desks serve hardware stockists, architects, and commercial contractors worldwide."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUsItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.num}
                  className="p-8 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] border-t-[#B08D57]/40 space-y-4 shadow-sm hover:border-[#B08D57]/60 transition-all duration-300 relative group"
                >
                  <span className="absolute top-6 right-6 font-serif text-sm font-bold text-[#666666]/60 group-hover:text-[#B08D57] transition-colors">
                    {item.num}
                  </span>
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#FAF9F6] border border-[#B08D57]/20 text-[#B08D57]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#222222]">{item.title}</h3>
                  <p className="text-xs text-[#666666] leading-relaxed font-normal">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ & EEAT TRADE KNOWLEDGE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeading
          subtitle="Frequently Asked Trade Questions"
          title="Architectural Hardware & Foundry FAQs"
          description="Common technical and procurement questions asked by architects, hardware distributors, and commercial contractors regarding solid brass manufacturing."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          <div className="p-6 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] space-y-2">
            <h3 className="font-serif font-bold text-base text-[#222222]">
              What is solid brass hardware and why is it preferred by architects?
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Solid brass hardware is manufactured from an alloy of copper and zinc without hollow cores or cheap zinc/iron filler metals. Architects prefer solid brass because it is naturally corrosion-resistant, antimicrobial, structural, extremely durable, and capable of taking hand-applied patinas and high-durability PVD coatings that age gracefully.
            </p>
          </div>

          <div className="p-6 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] space-y-2">
            <h3 className="font-serif font-bold text-base text-[#222222]">
              How long does solid brass architectural hardware last?
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              High-quality solid brass hardware lasts for decades—often outlasting the building itself. Unlike zinc alloys (zamak) or plated steel which pit and rust within 2–5 years, solid brass retains structural integrity for 50+ years even under heavy commercial usage.
            </p>
          </div>

          <div className="p-6 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] space-y-2">
            <h3 className="font-serif font-bold text-base text-[#222222]">
              What finish is best for coastal marine environments?
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              PVD (Physical Vapor Deposition) Titanium finishes and Marine-Grade 316 Stainless Steel or Unlacquered Naval Brass are best for coastal environments. PVD finishes create a molecular bond that resists salt spray, oxidation, UV degradation, and tarnishing for over 10 years without pitting.
            </p>
          </div>

          <div className="p-6 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] space-y-2">
            <h3 className="font-serif font-bold text-base text-[#222222]">
              What is the difference between forged brass and cast brass hardware?
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Forged brass is produced by heating solid brass billets and stamping them under extreme hydraulic pressure, yielding dense grain structure ideal for thin, high-stress lever handles. Cast brass involves pouring molten metal into sand or investment molds, allowing intricate organic shapes, heavy wall thicknesses, and ornate decorative detailing.
            </p>
          </div>

          <div className="p-6 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] space-y-2">
            <h3 className="font-serif font-bold text-base text-[#222222]">
              How do I clean and maintain antique brass architectural hardware?
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              To clean antique brass, wipe gently with a soft microfiber cloth dampened with warm water and mild soap. Avoid abrasive metal polishes, chemical solvents, or scouring pads which strip hand-applied patinas. Apply a thin coat of natural beeswax annually to preserve the protective luster.
            </p>
          </div>

          <div className="p-6 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] space-y-2">
            <h3 className="font-serif font-bold text-base text-[#222222]">
              Can Radiance manufacture custom OEM hardware from CAD drawings?
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Yes, Radiance provides complete OEM/ODM contract manufacturing at our foundry in Aligarh, India. We convert 3D CAD models or physical samples into precision brass tooling, produce 3D-printed wax prototypes, and manufacture custom hardware lines under strict confidentiality (NDA).
            </p>
          </div>
        </div>
      </section>

      {/* FINAL QUOTE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4F2ED] rounded-2xl p-8 sm:p-14 text-[#222222] shadow-sm border border-[#E5E2DA] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10">
            <span className="text-xs font-medium uppercase tracking-widest font-sans text-[#B08D57]">
              B2B Factory Direct Enquiry
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
              Require Direct Wholesale Pricing & Lead Times?
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] font-normal max-w-xl">
              Add products to your Quote List for a consolidated factory quotation. Our B2B export desk provides pricing within 24 hours.
            </p>
          </div>
          <Link
            href="/request-quote"
            className="px-8 py-3.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] font-sans text-xs font-medium uppercase tracking-widest rounded-[8px] transition-colors duration-200 flex-shrink-0 relative z-10"
          >
            Submit Trade RFQ Now
          </Link>
        </div>
      </section>
    </div>
  );
}
