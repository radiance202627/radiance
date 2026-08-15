import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getCollections } from '@/lib/services/collectionService';
import { CollectionCard } from '@/components/catalog/CollectionCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateCollectionSchema, getCanonicalUrl } from '@/lib/seo/schema';
import { collectionSeoMap } from '@/data/collectionSeo';
import { Layers, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

const canonicalUrl = getCanonicalUrl('/collections');

export const metadata: Metadata = {
  title: 'Architectural Hardware Collections | Heritage & Modern Series',
  description:
    'Explore curated architectural hardware series including Vintage Brass, Black Antique Ironmongery, Nautical Marine, and Decorative fittings.',
  keywords: [
    'Architectural Hardware Collections',
    'Vintage Brass Hardware Series',
    'Black Antique Hardware Collection',
    'Heritage Ironmongery',
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: 'website',
    url: canonicalUrl,
    title: 'Architectural Hardware Collections | Radiance',
    description:
      'Curated collections designed to complement period restorations, luxury coastal villas, and heritage developments.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architectural Hardware Collections | Radiance',
    description:
      'Curated collections designed to complement period restorations, luxury coastal villas, and heritage developments.',
  },
};

export const revalidate = 3600;

export default async function CollectionsPage() {
  const collections = await getCollections();

  const collectionSchema = generateCollectionSchema(
    'Architectural Hardware Collections',
    'Curated hardware series designed to complement period restorations, luxury coastal villas, and heritage developments.',
    '/collections'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      <JsonLd data={collectionSchema} />
      <Breadcrumbs items={[{ label: 'Collections' }]} />

      <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-6 sm:p-8 shadow-sm">
        <SectionHeading
          subtitle="Design-Led Hardware Series"
          title="Architectural Collections"
          description="Curated collections designed to complement period restorations, luxury coastal villas, modern minimalist apartments, and heritage hotels."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((col) => (
          <CollectionCard key={col.id} collection={col} />
        ))}
      </div>

      {/* COLLECTION ARCHITECTURAL DESIGN & FINISH GUIDE */}
      <section className="pt-8 border-t border-[#E5E2DA] space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-sans font-medium uppercase tracking-widest text-[#B08D57]">
            Editorial Architectural Guide
          </span>
          <h2 className="font-serif font-bold text-2xl text-[#222222]">
            Collection Design Inspirations & Architectural Compatibility
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(collectionSeoMap).map((seo) => (
            <div key={seo.slug} className="p-6 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#222222] border-b border-[#E5E2DA] pb-2">
                {seo.name}
              </h3>

              <div className="space-y-2 text-xs text-[#666666] leading-relaxed">
                <p>
                  <strong className="text-[#222222]">Design Inspiration:</strong> {seo.designInspiration}
                </p>
                <p>
                  <strong className="text-[#222222]">Architecture Styles:</strong> {seo.targetArchitectureStyle}
                </p>
                <p>
                  <strong className="text-[#222222]">Recommended Projects:</strong> {seo.recommendedProjects}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5E2DA]">
                <span className="text-[10px] font-sans font-medium text-[#B08D57] uppercase block mb-1.5">
                  Available Finishes:
                </span>
                <div className="flex flex-wrap gap-1">
                  {seo.availableFinishes.map((f, i) => (
                    <span key={i} className="text-[10px] bg-[#FAF9F6] border border-[#E5E2DA] px-2 py-0.5 rounded text-[#222222]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
