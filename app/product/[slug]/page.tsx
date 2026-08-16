import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/services/productService';
import { ProductDetailClient } from './ProductDetailClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateProductSchema, getCanonicalUrl } from '@/lib/seo/schema';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found' };

  const canonicalUrl = getCanonicalUrl(`/product/${product.slug}`);
  const metaDescription = product.shortDescription || product.description;
  const mainImage = product.images[0] || getCanonicalUrl('/og-image.jpg');

  return {
    title: `${product.name} | ${product.categoryName} | SB PATTERN WORKS`,
    description: metaDescription,
    keywords: [
      product.name,
      product.sku,
      product.material,
      product.categoryName,
      product.subcategoryName,
      ...product.finishes,
      'Architectural Hardware Manufacturer',
      'Radiance Hardware Exporter',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: `${product.name} (SKU: ${product.sku}) | Radiance Architectural Hardware`,
      description: metaDescription,
      images: [
        {
          url: mainImage,
          width: 1000,
          height: 1000,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Radiance Architectural Hardware`,
      description: metaDescription,
      images: [mainImage],
    },
  };
}

export const revalidate = 3600;

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId);
  const productSchema = generateProductSchema(product);

  return (
    <>
      <JsonLd data={productSchema} />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
