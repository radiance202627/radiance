import React from 'react';
import { Metadata } from 'next';
import { searchProducts } from '@/lib/services/productService';
import { SearchClient } from './SearchClient';

export const metadata: Metadata = {
  title: 'Search Catalog | Radiance Architectural Hardware',
  description: 'Search architectural hardware catalog by product name, SKU, material, and finish.',
  robots: {
    index: false,
    follow: true,
  },
};

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const products = await searchProducts(query);

  return <SearchClient products={products} query={query} />;
}
