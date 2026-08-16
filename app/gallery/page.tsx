import React from 'react';
import { Metadata } from 'next';
import { getGalleryAlbums } from '@/lib/services/galleryService';
import { GalleryClient } from './GalleryClient';
import { generateWebPageSchema, getCanonicalUrl } from '@/lib/seo/schema';
import { JsonLd } from '@/components/seo/JsonLd';

const canonicalUrl = getCanonicalUrl('/gallery');
const title = 'Factory, Manufacturing & Project Gallery | SB PATTERN WORKS';
const description = 'Explore our manufacturing gallery featuring brass founding, CNC lathe machining, custom craft patterns, trade show exhibits, and international export dispatches.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'SB PATTERN WORKS Gallery',
    'Brass Foundry Manufacturing Photos',
    'CNC Machining Showcase',
    'Hardware Factory Photos Aligarh',
    'Custom Metal Crafts Gallery',
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: 'website',
    url: canonicalUrl,
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export const revalidate = 3600;

export default async function PublicGalleryPage() {
  const initialData = await getGalleryAlbums({ status: 'PUBLISHED', limit: 12 });
  const webPageSchema = generateWebPageSchema(title, description, '/gallery');

  return (
    <>
      <JsonLd data={webPageSchema} />
      <GalleryClient initialData={initialData} />
    </>
  );
}
