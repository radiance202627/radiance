import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/services/productService';
import { ProductDetailClient } from './ProductDetailClient';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} (SKU: ${product.sku}) | B2B Architectural Hardware`,
    description: product.shortDescription,
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

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}
