import React from 'react';
import { Metadata } from 'next';
import { getCollections } from '@/lib/services/collectionService';
import { CollectionCard } from '@/components/catalog/CollectionCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Architectural Collections | B2B Hardware Manufacturer',
  description: 'Explore curated architectural hardware collections including Vintage, Black Antique, Nautical, and Decorative fittings.',
};

export const revalidate = 3600;

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-sans">
      <Breadcrumbs items={[{ label: 'Collections' }]} />

      <div className="bg-white rounded-lg border border-brand-border p-6 sm:p-8 shadow-sm">
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
    </div>
  );
}
