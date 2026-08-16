import React from 'react';
import { Metadata } from 'next';
import { getBlogPosts } from '@/lib/services/blogService';
import { BlogListClient } from './BlogListClient';
import { generateWebPageSchema, getCanonicalUrl } from '@/lib/seo/schema';
import { JsonLd } from '@/components/seo/JsonLd';

const canonicalUrl = getCanonicalUrl('/blog');
const title = 'Hardware Journal & Metallurgy Insights | SB PATTERN WORKS';
const description = 'Explore expert insights on architectural brass hardware, metal casting metallurgy, OEM manufacturing processes, and period ironmongery restoration.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'SB PATTERN WORKS Blog',
    'Brass Hardware Insights',
    'Metallurgy & Metal Casting',
    'OEM Hardware Development Guide',
    'Architectural Ironmongery Articles',
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: 'website',
    url: canonicalUrl,
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export const revalidate = 3600;

export default async function PublicBlogPage() {
  const initialData = await getBlogPosts({ status: 'PUBLISHED', limit: 12 });
  const webPageSchema = generateWebPageSchema(title, description, '/blog');

  return (
    <>
      <JsonLd data={webPageSchema} />
      <BlogListClient initialData={initialData} />
    </>
  );
}
