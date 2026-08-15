import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ShieldCheck, Layers, Sparkles, PackageCheck, Headphones, Globe2, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateWebPageSchema, generateFAQPageSchema, getCanonicalUrl } from '@/lib/seo/schema';

const canonicalUrl = getCanonicalUrl('/why-us');
const title = 'Why Choose Us | Direct Brass Foundry & Export Manufacturing Trust';
const description = 'Discover why leading architectural specifiers, hardware distributors, and international bulk buyers trust Radiance for direct factory supply.';

export const metadata: Metadata = {
  title: title,
  description: description,
  keywords: [
    'Direct Factory Hardware Supplier',
    'OEM Brass Hardware Manufacturer',
    'Architectural Hardware Wholesale',
    'Radiance Export Capabilities',
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

const b2bFaqs = [
  {
    question: 'Do you manufacture hardware directly at your foundry?',
    answer: 'Yes, Radiance operates an integrated brass founding and ironmongery production facility in Aligarh, India, performing in-house sand casting, die casting, machining, and hand patination.',
  },
  {
    question: 'What quality standards and testing do your products undergo?',
    answer: 'Our hardware undergoes virgin CuZn39Pb2 alloy metallurgical validation, ISO 9227 salt spray corrosion chamber testing, and BS EN 1906 200,000-cycle mechanical endurance runs.',
  },
  {
    question: 'Do you accept OEM, custom CAD, and private label requests?',
    answer: 'Yes, we provide direct OEM/ODM tooling services, custom CTC backsets, 7mm/8mm/9mm spindle sizes, laser logo marking, and export master carton packaging.',
  },
  {
    question: 'What are your export shipping terms and port logistics?',
    answer: 'We export container load shipments (FCL/LCL) via Nhava Sheva and Mundra ports on FOB, CIF, or CFR terms with complete customs export manifests.',
  },
];

export default function WhyUsPage() {
  const webPageSchema = generateWebPageSchema(title, description, '/why-us');
  const faqSchema = generateFAQPageSchema(b2bFaqs);
  const blocks = [
    {
      icon: ShieldCheck,
      title: 'Metallurgical & Quality Assurance',
      description: 'Virgin CuZn39Pb2 brass casting, hand micrometer inspection, ISO 9227 salt spray chamber finish testing, and 200,000-cycle mechanical endurance testing for high-traffic commercial doors.',
    },
    {
      icon: Layers,
      title: '12 Production Divisions',
      description: 'Comprehensive foundry catalog encompassing solid brass lever handles on rose/plate, mortise knobs, rim locks, casement stays, heavy cabinet pulls, railing clamps, and saddlery fittings.',
    },
    {
      icon: Sparkles,
      title: 'Authentic Patination & PVD',
      description: 'Hand-applied oxidation patinas including Aged Antique Brass, Oil Rubbed Bronze, Satin Chrome, and PVD Titanium Gold coatings designed for seamless multi-category project matching.',
    },
    {
      icon: PackageCheck,
      title: 'OEM Tooling & Private Label',
      description: 'Direct factory OEM/ODM production for international distributors, including bespoke CAD tooling, laser logo marking, custom backsets, and export packaging.',
    },
    {
      icon: Headphones,
      title: 'B2B Trade Desk & CAD Support',
      description: '24-hour turnaround on commercial RFQs, hardware schedule estimation, CAD drawing assistance, and architect sample dispatch for project specification.',
    },
    {
      icon: Globe2,
      title: 'Container Logistics & Customs Compliance',
      description: 'FCL & LCL container shipments via Nhava Sheva / Mundra ports, FOB/CIF trade terms, HS code classification, and complete export documentation for global importers.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      <JsonLd data={[webPageSchema, faqSchema]} />
      <Breadcrumbs items={[{ label: 'Why Us' }]} />

      <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-6 sm:p-10 shadow-sm space-y-4">
        <SectionHeading
          subtitle="Direct Foundry Production & Export Trust"
          title="Engineered for Architectural Specifiers & Global Hardware Importers"
          description="We eliminate intermediary markups by manufacturing brass, bronze, and iron hardware directly at our foundry in Aligarh, India. From custom CAD tooling to container port dispatch, we support distributors and commercial specifiers worldwide."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blocks.map((b, idx) => {
          const IconComponent = b.icon;
          return (
            <div
              key={idx}
              className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-6 shadow-sm hover:shadow-md hover:border-[#B08D57]/60 transition-all space-y-3"
            >
              <div className="p-3 bg-[#B08D57]/10 text-[#B08D57] rounded-xl w-fit border border-[#B08D57]/20">
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#222222]">
                {b.title}
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed font-sans font-normal">
                {b.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-[#F4F2ED] text-[#222222] rounded-2xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-[#E5E2DA]">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="font-serif font-bold text-2xl tracking-tight text-[#222222]">
            Partner Direct With an Established Indian Hardware Foundry
          </h2>
          <p className="text-xs text-[#666666] font-sans font-normal max-w-xl">
            Submit your item specification list or contact our export trade desk to request physical samples and volume container pricing.
          </p>
        </div>
        <Link
          href="/request-quote"
          className="px-7 py-3.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] font-sans text-xs font-medium uppercase tracking-widest rounded-[8px] transition-colors flex items-center gap-2 flex-shrink-0"
        >
          <span>Submit Factory RFQ</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
