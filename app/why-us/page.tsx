import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ShieldCheck, Layers, Sparkles, PackageCheck, Headphones, Globe2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why Us | B2B Hardware Manufacturing & Wholesale Trust',
  description: 'Discover why leading architectural specifiers, hardware distributors, and international buyers trust our B2B manufacturing capabilities.',
};

export default function WhyUsPage() {
  const blocks = [
    {
      icon: ShieldCheck,
      title: 'Quality Focus',
      description: 'Rigorous metallurgical standards, hand-inspection, salt spray finish testing, and mechanical cycle testing for commercial and luxury residential doors and cabinetry.',
    },
    {
      icon: Layers,
      title: 'Wide Product Range',
      description: 'Extensive catalog covering 12 main architectural categories including door lever handles, mortise knobs, cabinet pulls, window stays, railing clamps, and saddlery hardware.',
    },
    {
      icon: Sparkles,
      title: 'Custom Architectural Finishes',
      description: 'Seamless finish matching across multi-category hardware specifications, including Antique Brass, Satin Brass, PVD Gunmetal, Matt Black, Satin Chrome, and Oil Rubbed Bronze.',
    },
    {
      icon: PackageCheck,
      title: 'Bulk & OEM Production',
      description: 'Scalable manufacturing capacity designed for container-load exports, custom private label packaging, bespoke laser branding, and architectural project batching.',
    },
    {
      icon: Headphones,
      title: 'Dedicated B2B Trade Support',
      description: 'Direct trade desk support offering 24-hour RFQ pricing turnaround, technical CAD drawing assistance, sample dispatching, and hardware schedule estimations.',
    },
    {
      icon: Globe2,
      title: 'Global Export Logistics',
      description: 'Experienced in international freight, container consolidation, export documentation, and customs compliance for global importers and distributors.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      <Breadcrumbs items={[{ label: 'Why Us' }]} />

      <div className="bg-white rounded-lg border border-brand-border p-6 sm:p-10 shadow-sm space-y-4">
        <SectionHeading
          subtitle="B2B Trade Commitment"
          title="Built for Architectural Specifiers & Wholesale Buyers"
          description="We streamline hardware procurement for distributors, architects, interior designers, and commercial builders around the globe."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blocks.map((b, idx) => {
          const IconComponent = b.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-lg border border-brand-border p-6 shadow-sm hover:shadow-md hover:border-brand-brass/60 transition-all space-y-3"
            >
              <div className="p-3 bg-brand-brass/10 text-brand-brass rounded-lg w-fit">
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-brand-dark">
                {b.title}
              </h3>
              <p className="text-xs text-brand-text-muted leading-relaxed font-light">
                {b.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-brand-charcoal text-white rounded-lg p-8 sm:p-12 shadow-floating flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-border-dark">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="font-display font-bold text-2xl uppercase tracking-wide">
            Partner With a Reliable Hardware Exporter
          </h2>
          <p className="text-xs text-slate-300 font-light max-w-xl">
            Add items to your Quote List or contact our trade desk to request sample products and factory volume estimates.
          </p>
        </div>
        <Link
          href="/request-quote"
          className="px-8 py-4 bg-brand-brass hover:bg-brand-brass-dark text-white font-display text-xs font-bold uppercase tracking-widest rounded shadow transition-all flex items-center gap-2 flex-shrink-0"
        >
          <span>Start B2B Quote</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
