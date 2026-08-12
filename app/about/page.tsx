import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ShieldCheck, Globe2, Sparkles, Layers, FileText, Hammer, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Cast-Metal Architectural & Decorative Hardware',
  description: 'Discover Radience - Manufacturer of antique-inspired, traditional cast metal door, window, cabinet, and decorative hardware.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      {/* Header */}
      <div className="bg-white rounded-lg border border-brand-border p-6 sm:p-10 shadow-sm space-y-4">
        <SectionHeading
          subtitle="Corporate Profile & Craftsmanship"
          title="Cast-Metal Hardware Inspired by Antique & Vintage Designs"
          description="Radience is a manufacturer and supplier of physical, handcrafted-looking architectural and decorative metal hardware for trade buyers, architects, and designers."
        />
      </div>

      {/* Company Introduction Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-display font-semibold uppercase tracking-widest text-brand-brass">
            Our Brand Story
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-brand-dark" style={{ fontFamily: "var(--font-serif), serif" }}>
            Timeless Metalwork & Classical Hardware Design
          </h2>
          <p className="text-sm text-brand-text-muted leading-relaxed font-light">
            Radience manufactures and supplies cast-metal architectural and decorative hardware. Taking inspiration from antique, vintage, and traditional hardware designs, we produce physical, handcrafted-looking metal fittings that bring classical warmth and character to doors, cabinetry, windows, and interiors.
          </p>
          <p className="text-sm text-brand-text-muted leading-relaxed font-light">
            Our product range includes antique-inspired door handles, lever handles, mortise knobs, rim knobs, rim locks, door knockers, letter plates, push plates, door stoppers, hinges, house numbers, sign plates, cabinet pulls, window hardware, railing fittings, nautical hardware, decorative animal/nature forms, black antique ironmongery, curtain finials, shelf brackets, and saddlery hardware.
          </p>
        </div>

        <div className="p-6 bg-brand-charcoal text-white rounded-lg border border-brand-border-dark space-y-4 shadow-floating">
          <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider border-b border-slate-700 pb-2" style={{ fontFamily: "var(--font-serif), serif" }}>
            Product Character & Craftsmanship
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <Hammer className="w-4 h-4 text-brand-brass flex-shrink-0 mt-0.5" />
              <span><strong>Physical Metal Casting:</strong> Solid Brass, Sand-Cast Iron, Cast Bronze & Steel Fittings</span>
            </li>
            <li className="flex items-start gap-2">
              <Compass className="w-4 h-4 text-brand-brass flex-shrink-0 mt-0.5" />
              <span><strong>Design Inspiration:</strong> Vintage patterns, Victorian & Regency motifs, historic architectural metalwork</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-brand-brass flex-shrink-0 mt-0.5" />
              <span><strong>Hand Patinas:</strong> Hand-rubbed antique brass, aged copper, oil rubbed bronze, and black iron</span>
            </li>
            <li className="flex items-start gap-2">
              <Globe2 className="w-4 h-4 text-brand-brass flex-shrink-0 mt-0.5" />
              <span><strong>B2B Wholesale Supply:</strong> Serving hardware stockists, restoration builders, and trade buyers worldwide</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Structured Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-3">
          <div className="p-3 bg-brand-slate text-brand-brass rounded w-fit">
            <Hammer className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-base text-brand-dark" style={{ fontFamily: "var(--font-serif), serif" }}>Handcrafted Metal Appeal</h3>
          <p className="text-xs text-brand-text-muted leading-relaxed font-light">
            Every piece is molded and hand-finished to exhibit natural metal depth, weight, and authentic antique patina.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-3">
          <div className="p-3 bg-brand-slate text-brand-brass rounded w-fit">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-base text-brand-dark" style={{ fontFamily: "var(--font-serif), serif" }}>Comprehensive Catalog</h3>
          <p className="text-xs text-brand-text-muted leading-relaxed font-light">
            Covering 12 core product categories for doors, windows, cabinets, gates, shelf supports, saddlery, and decorative metalwork.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-3">
          <div className="p-3 bg-brand-slate text-brand-brass rounded w-fit">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-base text-brand-dark" style={{ fontFamily: "var(--font-serif), serif" }}>Wholesale B2B Enquiries</h3>
          <p className="text-xs text-brand-text-muted leading-relaxed font-light">
            Providing direct quotation responses and hardware schedules for distributors, contractors, and global buyers.
          </p>
        </div>
      </div>

      {/* CTA Footer Banner */}
      <div className="bg-brand-slate rounded-lg p-8 border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-display font-bold text-lg text-brand-dark uppercase tracking-wider" style={{ fontFamily: "var(--font-serif), serif" }}>
            Submit Your Hardware RFQ Enquiry
          </h3>
          <p className="text-xs text-brand-text-muted">
            Add items to your Quote List or contact our trade desk to request wholesale catalog estimates.
          </p>
        </div>
        <Link
          href="/request-quote"
          className="px-6 py-3 bg-brand-brass hover:bg-brand-brass-dark text-white font-display text-xs font-semibold uppercase tracking-wider rounded shadow transition-all flex items-center gap-2"
        >
          <FileText className="w-4 h-4" /> Request a Quote
        </Link>
      </div>

    </div>
  );
}
