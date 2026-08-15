import React from 'react';
import { Metadata } from 'next';
import { getProducts } from '@/lib/services/productService';
import { getCategories } from '@/lib/services/categoryService';
import { getCollections } from '@/lib/services/collectionService';
import { CatalogClient } from './CatalogClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateCollectionSchema, getCanonicalUrl } from '@/lib/seo/schema';

const canonicalUrl = getCanonicalUrl('/products');

export const metadata: Metadata = {
  title: 'Full Export Catalog | Solid Brass Architectural Hardware',
  description:
    'Browse our comprehensive export catalog of solid brass door handles, mortise knobs, cabinet pulls, casement stays, and ironmongery for global specifiers.',
  keywords: [
    'Architectural Hardware Catalog',
    'Solid Brass Door Handles',
    'Mortise Knobs Exporter',
    'Cabinet Hardware Catalog',
    'Radiance Export Catalog',
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: 'website',
    url: canonicalUrl,
    title: 'Full Export Catalog | Radiance Architectural Brass Hardware',
    description:
      'Browse our complete range of handcrafted solid brass, bronze, and iron architectural fittings.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Full Export Catalog | Radiance Hardware',
    description:
      'Browse our complete range of handcrafted solid brass, bronze, and iron architectural fittings.',
  },
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

  const collectionSchema = generateCollectionSchema(
    'Full Architectural Hardware Catalog',
    'Browse our full export catalog of solid brass door handles, mortise knobs, cabinet pulls, and window fittings.',
    '/products',
    products
  );

  return (
    <>
      <JsonLd data={collectionSchema} />
      <CatalogClient
        initialProducts={products}
        categories={categories}
        collections={collections}
        initialCategory={searchParams.category}
        initialSubcategory={searchParams.subcategory}
        initialCollection={searchParams.collection}
        initialQuery={searchParams.q}
      />
    </>
  );
}
