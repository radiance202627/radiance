import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ShieldCheck, Globe2, Sparkles, Layers, FileText, Hammer, Compass } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateWebPageSchema, generateOrganizationSchema, getCanonicalUrl } from '@/lib/seo/schema';

const canonicalUrl = getCanonicalUrl('/about');
const title = 'About Us | Brass Foundry & Architectural Hardware Manufacturer Exporter';
const description = 'Learn about Radiance - Indian foundry manufacturer exporting handcrafted solid brass, bronze, and iron architectural hardware to global specifiers and distributors.';

export const metadata: Metadata = {
  title: title,
  description: description,
  keywords: [
    'Radiance Hardware Foundry',
    'Aligarh Brass Foundry',
    'Brass Hardware Manufacturer History',
    'Ironmongery Exporter India',
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: 'website',
    url: canonicalUrl,
    title: title,
    description: description,
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
  },
};

export default function AboutPage() {
  const webPageSchema = generateWebPageSchema(title, description, '/about');
  const orgSchema = generateOrganizationSchema();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      <JsonLd data={[webPageSchema, orgSchema]} />
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      {/* Header */}
      <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-6 sm:p-10 shadow-sm space-y-4">
        <SectionHeading
          subtitle="Foundry Profile & Heritage Craftsmanship"
          title="Thirty Years of Architectural Metal Casting Excellence"
          description="Radiance is a direct foundry manufacturer of solid brass, bronze, and forged ironmongery. From our casting works in Aligarh, India, we export specification-grade architectural and decorative hardware to global distributors, specifiers, and importers."
        />
      </div>

      {/* Company Introduction Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-sans font-medium uppercase tracking-[0.20em] text-[#B08D57]">
            Our Foundry Heritage
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#222222] tracking-tight">
            Traditional Hand-Casting Meets Global Hardware Standards
          </h2>
          <p className="text-sm text-[#666666] leading-relaxed font-sans font-normal">
            Founded in the metalwork hub of Aligarh, India, Radiance has grown from a specialized brass workshop into an integrated export manufacturer. We blend centuries-old sand-casting and hand-chasing traditions with ISO-compliant metallurgical quality control and modern CAD tooling.
          </p>
          <p className="text-sm text-[#666666] leading-relaxed font-sans font-normal">
            Our 12 core production divisions manufacture solid brass lever handles on rose/plate, mortise knobs, rim latches, casement stays, heavy cabinet pulls, railing clamps, black antique ironmongery, and specialized saddlery hardware engineered for period restorations and luxury architectural developments.
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-[#F4F2ED] text-[#222222] rounded-2xl border border-[#E5E2DA] space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-xl text-[#222222] border-b border-[#E5E2DA] pb-3">
            Manufacturing & Export Credentials
          </h3>
          <ul className="space-y-3.5 text-xs text-[#666666] font-sans">
            <li className="flex items-start gap-3">
              <Hammer className="w-4 h-4 text-[#B08D57] flex-shrink-0 mt-0.5" />
              <span><strong className="text-[#222222]">In-House Alloy Founding:</strong> CuZn39Pb2 Virgin Brass Ingots, Sand-Cast Iron, Hand-Patinated Bronze</span>
            </li>
            <li className="flex items-start gap-3">
              <Compass className="w-4 h-4 text-[#B08D57] flex-shrink-0 mt-0.5" />
              <span><strong className="text-[#222222]">OEM Tooling & CAD Schedules:</strong> Custom CTC backsets, spindle sizes, and private-label packaging</span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#B08D57] flex-shrink-0 mt-0.5" />
              <span><strong className="text-[#222222]">Hand Patination & PVD:</strong> Aged Antique Brass, Oil Rubbed Bronze, Satin Chrome & PVD Gold</span>
            </li>
            <li className="flex items-start gap-3">
              <Globe2 className="w-4 h-4 text-[#B08D57] flex-shrink-0 mt-0.5" />
              <span><strong className="text-[#222222]">Global Container Shipments:</strong> FCL / LCL export logistics via Nhava Sheva / Mundra ports</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Structured Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] shadow-sm space-y-3">
          <div className="p-3 bg-[#FAF9F6] text-[#B08D57] rounded-xl w-fit border border-[#E5E2DA]">
            <Hammer className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#222222]">Authentic Sand Casting</h3>
          <p className="text-xs text-[#666666] leading-relaxed font-sans font-normal">
            Each brass fitting is poured in sand molds, hand-fettled, and patinated to reveal rich historical depth and solid tactile weight.
          </p>
        </div>

        <div className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] shadow-sm space-y-3">
          <div className="p-3 bg-[#FAF9F6] text-[#B08D57] rounded-xl w-fit border border-[#E5E2DA]">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#222222]">Complete Specification Range</h3>
          <p className="text-xs text-[#666666] leading-relaxed font-sans font-normal">
            Providing seamless finish matching across door, window, cabinet, and decorative hardware schedules for luxury projects.
          </p>
        </div>

        <div className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] shadow-sm space-y-3">
          <div className="p-3 bg-[#FAF9F6] text-[#B08D57] rounded-xl w-fit border border-[#E5E2DA]">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#222222]">Direct Factory Trade Desk</h3>
          <p className="text-xs text-[#666666] leading-relaxed font-sans font-normal">
            Offering 24-hour RFQ pricing turnaround, technical CAD drawing verification, and architect sample dispatch worldwide.
          </p>
        </div>
      </div>

      {/* CTA Footer Banner */}
      <div className="bg-[#F4F2ED] rounded-2xl p-8 border border-[#E5E2DA] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif font-bold text-xl text-[#222222]">
            Submit Your Hardware Quotation Request
          </h3>
          <p className="text-xs text-[#666666] font-sans font-normal">
            Consolidate your item schedule onto your Quote List or contact our export desk for factory container pricing.
          </p>
        </div>
        <Link
          href="/request-quote"
          className="px-6 py-3 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] font-sans text-xs font-medium uppercase tracking-wider rounded-[8px] transition-colors flex items-center gap-2 flex-shrink-0"
        >
          <FileText className="w-4 h-4" /> Request a Quote
        </Link>
      </div>

    </div>
  );
}
