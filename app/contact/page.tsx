import React from 'react';
import { Metadata } from 'next';
import { ContactClient } from './ContactClient';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  generateContactPageSchema,
  generateLocalBusinessSchema,
  getCanonicalUrl,
} from '@/lib/seo/schema';

const canonicalUrl = getCanonicalUrl('/contact');
const title = 'Contact Wholesale Division & Export Desk | Radiance Hardware';
const description =
  'Contact our trade specialists for OEM manufacturing, CAD hardware schedules, sample dispatches, and container load quotations.';

export const metadata: Metadata = {
  title: title,
  description: description,
  keywords: [
    'Radiance Hardware Contact',
    'Export Desk Aligarh Foundry',
    'B2B Hardware RFQ Inquiry',
    'Hardware Manufacturer Address',
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

export default function ContactPage() {
  const contactSchema = generateContactPageSchema();
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <JsonLd data={[contactSchema, localBusinessSchema]} />
      <ContactClient />
    </>
  );
}
