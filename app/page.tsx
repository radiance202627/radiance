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
import { ArrowRight, ShieldCheck, Layers, Sparkles, PackageCheck, Globe2, FileText, Hammer } from 'lucide-react';
import { TestimonialSection } from '@/components/home/TestimonialSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateWebsiteSchema, getCanonicalUrl } from '@/lib/seo/schema';

const canonicalUrl = getCanonicalUrl('/');

export const metadata: Metadata = {
  title: 'SB PATTERN WORKS | Architectural Hardware & Custom Metal Foundry Exporter',
  description:
    'SB PATTERN WORKS is a premier Indian foundry manufacturer exporting solid brass door handles, mortise knobs, cabinet pulls, window stays, and custom pattern metal components to global specifiers.',
  keywords: [
    'SB PATTERN WORKS',
    'Brass Hardware Manufacturer India',
    'Aligarh Metal Foundry',
    'Custom Craft Manufacturing',
    'Architectural Door Handles Wholesale',
    'Solid Brass Cabinet Pulls Exporter',
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: 'website',
    url: canonicalUrl,
    title: 'SB PATTERN WORKS | Architectural Hardware & Custom Metal Foundry',
    description:
      'Direct Indian foundry manufacturer exporting solid brass, bronze, copper, and custom pattern metal hardware worldwide.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SB PATTERN WORKS | Metal Foundry & Hardware Exporter',
    description:
      'Direct Indian foundry manufacturer exporting solid brass, bronze, copper, and custom pattern metal hardware worldwide.',
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
    <div className="space-y-12 sm:space-y-16 lg:space-y-20 pb-24 font-sans bg-[#FAF8F5] text-[#1C1917]">
      <JsonLd data={websiteSchema} />

      {/* GRAND EDITORIAL HERO SECTION */}
      <section className="relative bg-[#FAF8F5] text-[#1C1917] overflow-hidden border-b border-[#E6E1D7]">
        {/* Subtle Background Texture */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop"
            alt="SB Pattern Works Architectural Hardware"
            fill
            priority
            quality={80}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover object-center opacity-[0.06] mix-blend-multiply scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/90 to-[#FAF8F5]" />
        </div>

        {/* Hero Centered Editorial Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-14 pb-8 sm:pb-12 lg:pb-14 text-center space-y-4 sm:space-y-5 lg:space-y-6">
          <div className="eyebrow-tag justify-center mx-auto px-4 py-1.5 bg-[#F3F0E8] border border-[#E6E1D7] rounded-[4px]">
            <Hammer className="w-3.5 h-3.5 text-[#9E7B47] stroke-[1.5]" />
            <span>Architectural Brass Foundry & Exporter • Est. 1994</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-medium tracking-tight leading-[1.10] text-[#1C1917] max-w-4xl mx-auto">
            Hand-Cast Brass & Hardware Crafted for <span className="text-[#9E7B47] italic font-serif">Global Architectural Trade</span>
          </h1>

          <p className="text-sm sm:text-base text-[#6B635B] font-normal leading-relaxed max-w-2xl mx-auto">
            Direct factory manufacturer exporting solid brass, bronze, and hand-forged ironmongery. We supply architectural specifiers, commercial builders, hardware stockists, and B2B importers across North America, Europe, and the Middle East.
          </p>

          {/* Understated Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2">
            <Link
              href="/products"
              className="btn-luxury-primary w-full sm:w-auto"
            >
              <span>Browse Trade Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
            </Link>

            <Link
              href="/request-quote"
              className="btn-luxury-secondary w-full sm:w-auto"
            >
              <FileText className="w-3.5 h-3.5 text-[#9E7B47] stroke-[1.5]" />
              <span>Submit RFQ Enquiry</span>
            </Link>
          </div>

          {/* Heritage Metal Metadata Bar */}
          <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-t border-[#E6E1D7] text-xs text-[#6B635B] max-w-3xl mx-auto">
            <div className="space-y-1">
              <p className="font-serif font-medium text-[#1C1917] text-lg">Virgin Brass Alloys</p>
              <p className="text-[11px] text-[#6B635B]">CuZn39Pb2 Solid Brass & Sand-Cast Bronze</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif font-medium text-[#1C1917] text-lg">OEM Tooling & Custom CTC</p>
              <p className="text-[11px] text-[#6B635B]">Bespoke Architectural CAD Specifications</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif font-medium text-[#1C1917] text-lg">Export Compliance</p>
              <p className="text-[11px] text-[#6B635B]">BS EN 1906 / ISO 9227 Salt-Spray Tested</p>
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
      <section className="bg-[#F3F0E8] py-24 border-y border-[#E6E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeading
              subtitle="High-Demand Export Hardware"
              title="Featured Manufacturing Products"
              description="High-volume solid brass door handles, rim latches, friction stays, heavy-duty cabinet pulls, and decorative fittings."
            />
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9E7B47] hover:text-[#856637] transition-colors self-start md:self-auto"
            >
              <span>View Full Hardware Range ({featuredProducts.length}+)</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
      <section className="bg-[#FAF8F5] text-[#1C1917] py-24 border-t border-[#E6E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <SectionHeading
            subtitle="Direct Factory Capabilities"
            title="Why International Buyers & Specifiers Partner With SB Pattern Works"
            description="Our integrated foundry workflows, metallurgical controls, and direct export desks serve hardware stockists, architects, and commercial contractors worldwide."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUsItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.num}
                  className="p-8 bg-[#F3F0E8] rounded-[6px] border border-[#E6E1D7] space-y-4 shadow-none hover:border-[#9E7B47]/50 transition-all duration-500 relative group"
                >
                  <span className="absolute top-6 right-6 font-serif text-sm font-bold text-[#6B635B]/50 group-hover:text-[#9E7B47] transition-colors">
                    {item.num}
                  </span>
                  <div className="w-10 h-10 flex items-center justify-center rounded-[4px] bg-[#FAF8F5] border border-[#E6E1D7] text-[#9E7B47]">
                    <IconComp className="w-4.5 h-4.5 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-serif font-medium text-[#1C1917]">{item.title}</h3>
                  <p className="text-xs text-[#6B635B] leading-relaxed font-normal">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GLOBAL B2B CLIENT TESTIMONIALS SECTION */}
      <TestimonialSection />

      {/* FAQ & EEAT TRADE KNOWLEDGE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          subtitle="Frequently Asked Trade Questions"
          title="Architectural Hardware & Foundry FAQs"
          description="Common technical and procurement questions asked by architects, hardware distributors, and commercial contractors regarding solid brass manufacturing."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-7 bg-[#F3F0E8] rounded-[6px] border border-[#E6E1D7] space-y-2">
            <h3 className="font-serif font-medium text-lg text-[#1C1917]">
              What is solid brass hardware and why is it preferred by architects?
            </h3>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              Solid brass hardware is manufactured from an alloy of copper and zinc without hollow cores or cheap filler metals. Architects prefer solid brass because it is naturally corrosion-resistant, antimicrobial, structural, durable, and capable of taking hand-applied patinas and PVD coatings.
            </p>
          </div>

          <div className="p-7 bg-[#F3F0E8] rounded-[6px] border border-[#E6E1D7] space-y-2">
            <h3 className="font-serif font-medium text-lg text-[#1C1917]">
              How long does solid brass architectural hardware last?
            </h3>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              High-quality solid brass hardware lasts for decades—often outlasting the building itself. Unlike zinc alloys (zamak) or plated steel which pit and rust within 2–5 years, solid brass retains structural integrity for 50+ years even under heavy commercial usage.
            </p>
          </div>

          <div className="p-7 bg-[#F3F0E8] rounded-[6px] border border-[#E6E1D7] space-y-2">
            <h3 className="font-serif font-medium text-lg text-[#1C1917]">
              What finish is best for coastal marine environments?
            </h3>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              PVD (Physical Vapor Deposition) Titanium finishes and Marine-Grade 316 Stainless Steel or Unlacquered Naval Brass are best for coastal environments. PVD finishes create a molecular bond that resists salt spray, oxidation, UV degradation, and tarnishing.
            </p>
          </div>

          <div className="p-7 bg-[#F3F0E8] rounded-[6px] border border-[#E6E1D7] space-y-2">
            <h3 className="font-serif font-medium text-lg text-[#1C1917]">
              What is the difference between forged brass and cast brass hardware?
            </h3>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              Forged brass is produced by heating solid brass billets and stamping them under extreme hydraulic pressure. Cast brass involves pouring molten metal into sand or investment molds, allowing intricate organic shapes, heavy wall thicknesses, and ornate detailing.
            </p>
          </div>

          <div className="p-7 bg-[#F3F0E8] rounded-[6px] border border-[#E6E1D7] space-y-2">
            <h3 className="font-serif font-medium text-lg text-[#1C1917]">
              How do I clean and maintain antique brass architectural hardware?
            </h3>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              To clean antique brass, wipe gently with a soft microfiber cloth dampened with warm water and mild soap. Avoid abrasive metal polishes or chemical solvents which strip hand-applied patinas. Apply a thin coat of natural beeswax annually to preserve the protective luster.
            </p>
          </div>

          <div className="p-7 bg-[#F3F0E8] rounded-[6px] border border-[#E6E1D7] space-y-2">
            <h3 className="font-serif font-medium text-lg text-[#1C1917]">
              Can SB Pattern Works manufacture custom OEM hardware from CAD drawings?
            </h3>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              Yes, SB Pattern Works provides complete OEM/ODM contract manufacturing at our foundry in Aligarh, India. We convert 3D CAD models or physical samples into precision brass tooling and produce custom hardware lines under strict confidentiality (NDA).
            </p>
          </div>
        </div>
      </section>

      {/* FINAL QUOTE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F3F0E8] rounded-[6px] p-8 sm:p-14 text-[#1C1917] border border-[#E6E1D7] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10">
            <span className="eyebrow-tag">
              B2B Factory Direct Enquiry
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight">
              Require Direct Wholesale Pricing & Lead Times?
            </h2>
            <p className="text-xs sm:text-sm text-[#6B635B] max-w-xl">
              Add products to your Quote List for a consolidated factory quotation. Our B2B export desk provides pricing within 24 hours.
            </p>
          </div>
          <Link
            href="/request-quote"
            className="btn-luxury-primary flex-shrink-0 relative z-10"
          >
            Submit Trade RFQ Now
          </Link>
        </div>
      </section>
    </div>
  );
}
