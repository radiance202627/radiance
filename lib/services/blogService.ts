import { prisma } from '@/lib/prisma';
import { BlogPostStatus, Prisma } from '@prisma/client';
import { getCanonicalUrl } from '@/lib/seo/schema';
import { generateSlug } from '@/lib/utils/slug';

export interface CreateBlogPostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  imageAlt?: string;
  category?: string;
  tags?: string[];
  author?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  readingTime?: string;
  featured?: boolean;
  publishDate?: Date | string;
  status?: BlogPostStatus;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {}

function calculateReadingTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export async function getBlogPosts(options?: {
  status?: BlogPostStatus | 'ALL' | 'TRASH';
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}) {
  const {
    status = 'PUBLISHED',
    category,
    tag,
    search,
    featured,
    page = 1,
    limit = 12,
  } = options || {};

  try {
    const where: Prisma.BlogPostWhereInput = {};

    if (status === 'TRASH') {
      where.deletedAt = { not: null };
    } else {
      where.deletedAt = null;
      if (status !== 'ALL') {
        where.status = status as BlogPostStatus;
      }
    }

    if (category && category !== 'all') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    let filteredPosts = posts;
    if (tag) {
      filteredPosts = posts.filter((p) => {
        if (Array.isArray(p.tags)) {
          return (p.tags as any).some((t: any) => String(t).toLowerCase() === tag.toLowerCase());
        }
        return false;
      });
    }

    return {
      posts: filteredPosts,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  } catch (err) {
    console.warn('[BLOG_SERVICE_DB_WARN]', err);
    return { posts: [], total: 0, page: 1, totalPages: 1 };
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    });
  } catch (err) {
    console.warn('[BLOG_SERVICE_SLUG_WARN]', err);
    return null;
  }
}

export async function getBlogPostById(id: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { id },
    });
  } catch (err) {
    return null;
  }
}

export async function createBlogPost(data: CreateBlogPostInput) {
  const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);
  const readingTime = data.readingTime || calculateReadingTime(data.content);

  return await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      content: data.content,
      featuredImage: data.featuredImage || null,
      imageAlt: data.imageAlt || null,
      category: data.category || 'Architectural Hardware',
      tags: data.tags || [],
      author: data.author || 'SB Pattern Works',
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.excerpt || null,
      canonicalUrl: data.canonicalUrl || getCanonicalUrl(`/blog/${slug}`),
      ogImage: data.ogImage || data.featuredImage || null,
      readingTime,
      featured: data.featured ?? false,
      publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
      status: data.status || BlogPostStatus.DRAFT,
    },
  });
}

export async function updateBlogPost(id: string, data: UpdateBlogPostInput) {
  const updateData: Prisma.BlogPostUpdateInput = { ...data };

  if (data.title && !data.slug) {
    updateData.slug = generateSlug(data.title);
  } else if (data.slug) {
    updateData.slug = generateSlug(data.slug);
  }

  if (data.content) {
    updateData.readingTime = data.readingTime || calculateReadingTime(data.content);
  }

  if (data.publishDate) {
    updateData.publishDate = new Date(data.publishDate);
  }

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const finalSlug = (updateData.slug as string) || existing?.slug || 'article';
  updateData.canonicalUrl = data.canonicalUrl || getCanonicalUrl(`/blog/${finalSlug}`);

  return await prisma.blogPost.update({
    where: { id },
    data: updateData,
  });
}

export async function softDeleteBlogPost(id: string) {
  return await prisma.blogPost.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function restoreBlogPost(id: string) {
  return await prisma.blogPost.update({
    where: { id },
    data: { deletedAt: null },
  });
}

export async function hardDeleteBlogPost(id: string) {
  return await prisma.blogPost.delete({
    where: { id },
  });
}

export async function getRelatedBlogPosts(currentPostId: string, category?: string | null, limit = 3) {
  try {
    return await prisma.blogPost.findMany({
      where: {
        id: { not: currentPostId },
        deletedAt: null,
        status: BlogPostStatus.PUBLISHED,
        category: category ? { equals: category } : undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  } catch {
    return [];
  }
}
