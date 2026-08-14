import React from 'react';
import { getAllQuoteRequests } from '@/lib/services/quoteService';
import { QuotesClient } from './QuotesClient';

export const revalidate = 0; // Dynamic route for live admin data

export default async function AdminQuotesPage() {
  try {
    const quotes = await getAllQuoteRequests();
    return <QuotesClient initialQuotes={JSON.parse(JSON.stringify(quotes || []))} />;
  } catch (error) {
    console.error('Error loading AdminQuotesPage:', error);
    return <QuotesClient initialQuotes={[]} />;
  }
}
