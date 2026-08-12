import React from 'react';
import { Metadata } from 'next';
import { QuoteClient } from './QuoteClient';

export const metadata: Metadata = {
  title: 'Your Quote List | B2B Architectural Hardware',
  description: 'Review selected architectural hardware products and prepare your Request for Quote (RFQ) enquiry.',
};

export default function QuotePage() {
  return <QuoteClient />;
}
