import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGalleryAlbumBySlug } from '@/lib/services/galleryService';
import { GalleryAlbumClient } from './GalleryAlbumClient';
import { generateGallerySchema, generateBreadcrumbSchema, getCanonicalUrl } from '@/lib/seo/schema';
import { JsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const album = await getGalleryAlbumBySlug(params.slug);
  if (!album) return {};

  const canonical = getCanonicalUrl(`/gallery/${album.slug}`);
  const title = album.seoTitle || `${album.title} | SB PATTERN WORKS Gallery`;
  const description = album.seoDescription || album.description || album.title;
  const image = album.featuredImage || (album.items && album.items[0]?.url) || getCanonicalUrl('/og-image.jpg');

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: album.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export const revalidate = 3600;

export default async function SingleGalleryAlbumPage({ params }: { params: { slug: string } }) {
  const album = await getGalleryAlbumBySlug(params.slug);
  if (!album) {
    notFound();
  }

  const gallerySchema = generateGallerySchema({
    title: album.title,
    description: album.description,
    slug: album.slug,
    items: album.items,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Gallery', url: '/gallery' },
    { name: album.category || 'Albums', url: `/gallery?category=${encodeURIComponent(album.category || '')}` },
    { name: album.title },
  ]);

  return (
    <>
      <JsonLd data={[gallerySchema, breadcrumbSchema]} />
      <GalleryAlbumClient album={album} />
    </>
  );
}
