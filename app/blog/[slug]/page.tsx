import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/services/blogService';
import { BlogPostClient } from './BlogPostClient';
import { generateArticleSchema, generateBreadcrumbSchema, getCanonicalUrl } from '@/lib/seo/schema';
import { JsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};

  const canonical = post.canonicalUrl || getCanonicalUrl(`/blog/${post.slug}`);
  const title = post.seoTitle || `${post.title} | SB PATTERN WORKS Blog`;
  const description = post.seoDescription || post.excerpt || post.title;
  const image = post.ogImage || post.featuredImage || getCanonicalUrl('/og-image.jpg');

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      publishedTime: post.publishDate ? new Date(post.publishDate).toISOString() : new Date(post.createdAt).toISOString(),
      authors: [post.author || 'SB Pattern Works'],
      images: [{ url: image, width: 1200, height: 630, alt: post.imageAlt || post.title }],
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

export default async function SingleBlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(post.id, post.category, 3);

  const articleSchema = generateArticleSchema({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    featuredImage: post.featuredImage,
    author: post.author,
    publishDate: post.publishDate,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Blog', url: '/blog' },
    { name: post.category || 'Articles', url: `/blog?category=${encodeURIComponent(post.category || '')}` },
    { name: post.title },
  ]);

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
