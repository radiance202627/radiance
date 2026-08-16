import { prisma } from '@/lib/prisma';
import { GalleryStatus, Prisma } from '@prisma/client';
import { generateSlug } from '@/lib/utils/slug';

export const GALLERY_CATEGORIES = [
  'Factory',
  'Manufacturing',
  'Products',
  'Projects',
  'Installations',
  'Trade Shows',
  'Export Shipments',
  'Packaging',
  'Mockups',
  'Architecture',
  'Custom Work',
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export interface CreateGalleryItemInput {
  url: string;
  title?: string;
  altText?: string;
  caption?: string;
  sortOrder?: number;
}

export interface CreateGalleryAlbumInput {
  title: string;
  slug?: string;
  description?: string;
  category?: string;
  projectType?: string;
  featuredImage?: string;
  sortOrder?: number;
  status?: GalleryStatus;
  seoTitle?: string;
  seoDescription?: string;
  items?: CreateGalleryItemInput[];
}

export interface UpdateGalleryAlbumInput extends Partial<CreateGalleryAlbumInput> {}

export async function getGalleryAlbums(options?: {
  status?: GalleryStatus | 'ALL' | 'TRASH';
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const {
    status = 'PUBLISHED',
    category,
    search,
    page = 1,
    limit = 12,
  } = options || {};

  try {
    const where: Prisma.GalleryAlbumWhereInput = {};

    if (status === 'TRASH') {
      where.deletedAt = { not: null };
    } else {
      where.deletedAt = null;
      if (status !== 'ALL') {
        where.status = status as GalleryStatus;
      }
    }

    if (category && category !== 'All') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { projectType: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [albums, total] = await Promise.all([
      prisma.galleryAlbum.findMany({
        where,
        include: {
          items: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.galleryAlbum.count({ where }),
    ]);

    return {
      albums,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  } catch (err) {
    console.warn('[GALLERY_SERVICE_DB_WARN]', err);
    return { albums: [], total: 0, page: 1, totalPages: 1 };
  }
}

export async function getGalleryAlbumBySlug(slug: string) {
  try {
    return await prisma.galleryAlbum.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  } catch (err) {
    console.warn('[GALLERY_SERVICE_SLUG_WARN]', err);
    return null;
  }
}

export async function getGalleryAlbumById(id: string) {
  try {
    return await prisma.galleryAlbum.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  } catch (err) {
    return null;
  }
}

export async function createGalleryAlbum(data: CreateGalleryAlbumInput) {
  const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);

  return await prisma.galleryAlbum.create({
    data: {
      title: data.title,
      slug,
      description: data.description || null,
      category: data.category || 'Manufacturing',
      projectType: data.projectType || null,
      featuredImage: data.featuredImage || (data.items && data.items[0]?.url) || null,
      sortOrder: data.sortOrder ?? 0,
      status: data.status || GalleryStatus.PUBLISHED,
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.description || null,
      items: data.items
        ? {
            create: data.items.map((item, idx) => ({
              url: item.url,
              title: item.title || null,
              altText: item.altText || data.title,
              caption: item.caption || null,
              sortOrder: item.sortOrder ?? idx,
            })),
          }
        : undefined,
    },
    include: {
      items: true,
    },
  });
}

export async function updateGalleryAlbum(id: string, data: UpdateGalleryAlbumInput) {
  const updateData: Prisma.GalleryAlbumUpdateInput = {
    title: data.title,
    description: data.description,
    category: data.category,
    projectType: data.projectType,
    featuredImage: data.featuredImage,
    sortOrder: data.sortOrder,
    status: data.status,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
  };

  if (data.title && !data.slug) {
    updateData.slug = generateSlug(data.title);
  } else if (data.slug) {
    updateData.slug = generateSlug(data.slug);
  }

  if (data.items) {
    await prisma.galleryItem.deleteMany({ where: { albumId: id } });
    updateData.items = {
      create: data.items.map((item, idx) => ({
        url: item.url,
        title: item.title || null,
        altText: item.altText || data.title || 'Gallery item',
        caption: item.caption || null,
        sortOrder: item.sortOrder ?? idx,
      })),
    };
  }

  return await prisma.galleryAlbum.update({
    where: { id },
    data: updateData,
    include: {
      items: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}

export async function softDeleteGalleryAlbum(id: string) {
  return await prisma.galleryAlbum.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function restoreGalleryAlbum(id: string) {
  return await prisma.galleryAlbum.update({
    where: { id },
    data: { deletedAt: null },
  });
}

export async function hardDeleteGalleryAlbum(id: string) {
  return await prisma.galleryAlbum.delete({
    where: { id },
  });
}
