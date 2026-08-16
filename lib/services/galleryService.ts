import { prisma } from '@/lib/prisma';
import { GalleryStatus, Prisma } from '@prisma/client';
import { generateSlug } from '@/lib/utils/slug';
import { revalidatePath } from 'next/cache';

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

    console.log(`[GALLERY_SERVICE_GET] Status: ${status}, Albums fetched: ${albums.length}, Total: ${total}`);

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
    const album = await prisma.galleryAlbum.findFirst({
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

    console.log(`[GALLERY_SERVICE_SLUG] Slug: ${slug}, Found: ${!!album}, Items count: ${album?.items?.length || 0}`);
    return album;
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

  const album = await prisma.galleryAlbum.create({
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
      items: Array.isArray(data.items) && data.items.length > 0
        ? {
            create: data.items.map((item, idx) => ({
              url: item.url,
              title: item.title || `Photo ${idx + 1}`,
              altText: item.altText || data.title,
              caption: item.caption || null,
              sortOrder: item.sortOrder ?? idx + 1,
            })),
          }
        : undefined,
    },
    include: {
      items: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  console.log(`[GALLERY_SERVICE_CREATE] Album created ID: ${album.id}, Slug: ${album.slug}, Items saved: ${album.items.length}`);

  try {
    revalidatePath('/gallery');
    revalidatePath(`/gallery/${album.slug}`);
  } catch (e) {
    console.warn('[REVALIDATION_WARN]', e);
  }

  return album;
}

export async function updateGalleryAlbum(id: string, data: UpdateGalleryAlbumInput) {
  const existing = await prisma.galleryAlbum.findUnique({ where: { id } });

  const updateData: Prisma.GalleryAlbumUpdateInput = {
    title: data.title,
    description: data.description,
    category: data.category,
    projectType: data.projectType,
    featuredImage: data.featuredImage || (data.items && data.items[0]?.url) || undefined,
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

  if (Array.isArray(data.items)) {
    await prisma.galleryItem.deleteMany({ where: { albumId: id } });
    if (data.items.length > 0) {
      updateData.items = {
        create: data.items.map((item, idx) => ({
          url: item.url,
          title: item.title || `Photo ${idx + 1}`,
          altText: item.altText || data.title || 'Gallery item',
          caption: item.caption || null,
          sortOrder: item.sortOrder ?? idx + 1,
        })),
      };
    }
  }

  const updated = await prisma.galleryAlbum.update({
    where: { id },
    data: updateData,
    include: {
      items: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  console.log(`[GALLERY_SERVICE_UPDATE] Album updated ID: ${updated.id}, Slug: ${updated.slug}, Items saved: ${updated.items.length}`);

  try {
    revalidatePath('/gallery');
    if (existing?.slug) revalidatePath(`/gallery/${existing.slug}`);
    if (updated.slug) revalidatePath(`/gallery/${updated.slug}`);
  } catch (e) {
    console.warn('[REVALIDATION_WARN]', e);
  }

  return updated;
}

export async function softDeleteGalleryAlbum(id: string) {
  const album = await prisma.galleryAlbum.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  try {
    revalidatePath('/gallery');
  } catch (e) {}
  return album;
}

export async function restoreGalleryAlbum(id: string) {
  const album = await prisma.galleryAlbum.update({
    where: { id },
    data: { deletedAt: null },
  });
  try {
    revalidatePath('/gallery');
  } catch (e) {}
  return album;
}

export async function hardDeleteGalleryAlbum(id: string) {
  const album = await prisma.galleryAlbum.delete({
    where: { id },
  });
  try {
    revalidatePath('/gallery');
  } catch (e) {}
  return album;
}
