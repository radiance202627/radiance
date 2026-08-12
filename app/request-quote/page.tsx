import React from 'react';
import { Metadata } from 'next';
import { RequestQuoteClient } from './RequestQuoteClient';

export const metadata: Metadata = {
  title: 'Request a Quote (RFQ) | B2B Architectural Hardware Manufacturer',
  description: 'Submit your B2B enquiry for architectural door hardware, cabinet pulls, window stays, and custom finishes.',
};

export default function RequestQuotePage() {
  return <RequestQuoteClient />;
}
