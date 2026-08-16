import prisma, { withDbTimeout } from '@/lib/prisma';
import { collections as mockCollections } from '@/data/collections';
import { Collection } from '@/lib/types';
import { CollectionStatus } from '@prisma/client';
import { generateUniqueSlug } from '@/lib/utils/slug';

export async function getCollections(): Promise<Collection[]> {
  try {
    const dbCollections = await withDbTimeout(
      prisma.collection.findMany({
        where: { status: CollectionStatus.ACTIVE, deletedAt: null },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      })
    );

    if (dbCollections && dbCollections.length > 0) {
      return dbCollections.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        image: c.image || '/images/placeholder.jpg',
        featured: c.featured,
      }));
    }
  } catch (error) {
    console.warn('Database error or timeout in getCollections, falling back to mock data');
  }

  return mockCollections;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  try {
    const c = await withDbTimeout(
      prisma.collection.findFirst({
        where: { slug, deletedAt: null },
      })
    );

    if (c) {
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        image: c.image || '/images/placeholder.jpg',
        featured: c.featured,
      };
    }
  } catch (error) {
    console.warn('Database error or timeout in getCollectionBySlug, falling back to mock data');
  }

  const mock = mockCollections.find((c) => c.slug === slug);
  return mock || null;
}

// ADMIN SERVICE METHODS
export async function getAllCollectionsAdmin(includeDeleted = false) {
  try {
    const res = await withDbTimeout(
      prisma.collection.findMany({
        where: includeDeleted ? {} : { deletedAt: null },
        include: {
          _count: { select: { products: true } },
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      })
    );
    if (res && res.length > 0) return res;
  } catch {
    console.warn('Database timeout in getAllCollectionsAdmin, using fallback catalog');
  }

  return mockCollections.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    featured: c.featured,
    sortOrder: 1,
    status: 'ACTIVE',
    _count: { products: 8 },
  }));
}

export async function createCollection(data: {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  featured?: boolean;
  sortOrder?: number;
  status?: CollectionStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  createdBy?: string;
}) {
  const finalSlug = data.slug ? data.slug : await generateUniqueSlug('collection', data.name);

  return prisma.collection.create({
    data: {
      name: data.name,
      slug: finalSlug,
      description: data.description,
      image: data.image,
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 0,
      status: data.status || CollectionStatus.ACTIVE,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,
      canonicalUrl: data.canonicalUrl,
      ogImage: data.ogImage,
      createdBy: data.createdBy,
    },
  });
}

export async function updateCollection(id: string, inputData: any) {
  const rawData = { ...inputData };

  let slug = rawData.slug;
  if (rawData.name && !slug) {
    slug = await generateUniqueSlug('collection', rawData.name, id);
  }

  const updateData: any = {};
  if (rawData.name !== undefined) updateData.name = rawData.name;
  if (slug !== undefined) updateData.slug = slug;
  if (rawData.description !== undefined) updateData.description = rawData.description || null;
  if (rawData.image !== undefined) updateData.image = rawData.image || null;
  if (rawData.featured !== undefined) updateData.featured = Boolean(rawData.featured);
  if (rawData.sortOrder !== undefined) updateData.sortOrder = Number(rawData.sortOrder);
  if (rawData.status !== undefined) updateData.status = rawData.status;
  if (rawData.seoTitle !== undefined) updateData.seoTitle = rawData.seoTitle || null;
  if (rawData.seoDescription !== undefined) updateData.seoDescription = rawData.seoDescription || null;
  if (rawData.seoKeywords !== undefined) updateData.seoKeywords = rawData.seoKeywords || null;
  if (rawData.canonicalUrl !== undefined) updateData.canonicalUrl = rawData.canonicalUrl || null;
  if (rawData.ogImage !== undefined) updateData.ogImage = rawData.ogImage || null;
  if (rawData.updatedBy !== undefined) updateData.updatedBy = rawData.updatedBy || null;

  return prisma.collection.update({
    where: { id },
    data: updateData,
  });
}

export async function softDeleteCollection(id: string, updatedBy?: string) {
  return prisma.collection.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      updatedBy,
    },
  });
}

export async function restoreCollection(id: string) {
  return prisma.collection.update({
    where: { id },
    data: { deletedAt: null },
  });
}

export async function deleteCollection(id: string) {
  return softDeleteCollection(id);
}
