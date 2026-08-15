import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubcategoryBySlug, getCategories } from '@/lib/services/categoryService';
import { getProducts } from '@/lib/services/productService';
import { getCollections } from '@/lib/services/collectionService';
import { CatalogClient } from '../../CatalogClient';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateCollectionSchema, getCanonicalUrl } from '@/lib/seo/schema';

export async function generateMetadata({
  params,
}: {
  params: { category: string; subcategory: string };
}): Promise<Metadata> {
  const result = await getSubcategoryBySlug(params.category, params.subcategory);
  if (!result) return { title: 'Subcategory Not Found' };

  const canonicalUrl = getCanonicalUrl(`/products/${result.category.slug}/${result.subcategory.slug}`);

  return {
    title: `${result.subcategory.name} - ${result.category.name} | Radiance Hardware`,
    description: result.subcategory.description,
    keywords: [
      result.subcategory.name,
      result.category.name,
      'Architectural Hardware Exporter',
      'Solid Brass Ironmongery',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `${result.subcategory.name} (${result.category.name}) | Radiance Architectural Hardware`,
      description: result.subcategory.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${result.subcategory.name} | Radiance Hardware`,
      description: result.subcategory.description,
    },
  };
}

export const revalidate = 3600;

export default async function SubcategoryPage({
  params,
}: {
  params: { category: string; subcategory: string };
}) {
  const result = await getSubcategoryBySlug(params.category, params.subcategory);
  if (!result) notFound();

  const { category, subcategory } = result;
  const allProducts = await getProducts();
  const categories = await getCategories();
  const collections = await getCollections();

  const subcategoryProducts = allProducts.filter(
    (p) => p.categorySlug === category.slug && p.subcategorySlug === subcategory.slug
  );

  const collectionSchema = generateCollectionSchema(
    `${subcategory.name} (${category.name})`,
    subcategory.description,
    `/products/${category.slug}/${subcategory.slug}`,
    subcategoryProducts
  );

  return (
    <div className="space-y-8 pb-16 font-sans">
      <JsonLd data={collectionSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs
          items={[
            { label: 'Products', href: '/products' },
            { label: category.name, href: `/products/${category.slug}` },
            { label: subcategory.name },
          ]}
        />
      </div>

      {/* Catalog Filter & Products Grid */}
      <CatalogClient
        initialProducts={subcategoryProducts}
        categories={categories}
        collections={collections}
        initialCategory={category.slug}
        initialSubcategory={subcategory.slug}
      />
    </div>
  );
}
