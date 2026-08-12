import React from 'react';
import { Metadata } from 'next';
import { getProducts } from '@/lib/services/productService';
import { getCategories } from '@/lib/services/categoryService';
import { getCollections } from '@/lib/services/collectionService';
import { CatalogClient } from './CatalogClient';

export const metadata: Metadata = {
  title: 'Full Product Catalog | B2B Architectural Hardware',
  description: 'Browse our full export catalog of architectural door handles, mortise knobs, cabinet pulls, window stays, and railing fittings.',
};

export const revalidate = 3600;

interface ProductsPageProps {
  searchParams: {
    category?: string;
    subcategory?: string;
    collection?: string;
    q?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = await getProducts();
  const categories = await getCategories();
  const collections = await getCollections();

  return (
    <CatalogClient
      initialProducts={products}
      categories={categories}
      collections={collections}
      initialCategory={searchParams.category}
      initialSubcategory={searchParams.subcategory}
      initialCollection={searchParams.collection}
      initialQuery={searchParams.q}
    />
  );
}
