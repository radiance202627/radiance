import React from 'react';
import { Metadata } from 'next';
import { CustomCraftClient } from './CustomCraftClient';
import { generateWebPageSchema, getCanonicalUrl } from '@/lib/seo/schema';
import { JsonLd } from '@/components/seo/JsonLd';

const canonicalUrl = getCanonicalUrl('/custom-craft');
const title = 'Custom Craft Manufacturing & OEM Metal Foundry | SB PATTERN WORKS';
const description = 'Custom manufacturing enquiry portal for OEM metal development, 3D CAD pattern making, sand & die casting, precision machining, and custom hardware finishing.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'Custom Craft Manufacturing',
    'OEM Metal Development',
    'Pattern Development Aligarh',
    'Custom Brass Casting',
    'CAD to Production',
    'Bespoke Metal Hardware',
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

export default function CustomCraftPage() {
  const webPageSchema = generateWebPageSchema(title, description, '/custom-craft');

  return (
    <>
      <JsonLd data={webPageSchema} />
      <CustomCraftClient />
    </>
  );
}
