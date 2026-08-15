import React from 'react';
import { Metadata } from 'next';
import { RequestQuoteClient } from './RequestQuoteClient';
import { getCanonicalUrl } from '@/lib/seo/schema';

const canonicalUrl = getCanonicalUrl('/request-quote');

export const metadata: Metadata = {
  title: 'Request a Quote (RFQ) | Direct Factory Hardware Quotations',
  description:
    'Submit your B2B enquiry for solid brass door hardware, mortise knobs, cabinet pulls, window stays, and custom OEM finishes.',
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: 'website',
    url: canonicalUrl,
    title: 'Request a Quote (RFQ) | Radiance Architectural Hardware',
    description: 'Submit your B2B wholesale enquiry for direct factory pricing.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request a Quote (RFQ) | Radiance Hardware',
    description: 'Submit your B2B wholesale enquiry for direct factory pricing.',
  },
};

export default function RequestQuotePage() {
  return <RequestQuoteClient />;
}
