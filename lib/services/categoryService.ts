import prisma, { withDbTimeout } from '@/lib/prisma';
import { categories as mockCategories } from '@/data/categories';
import { Category, Subcategory } from '@/lib/types';
import { generateUniqueSlug } from '@/lib/utils/slug';

export async function getCategories(): Promise<Category[]> {
  try {
    const dbCategories = await withDbTimeout(
      prisma.category.findMany({
        where: { parentId: null, status: 'ACTIVE', deletedAt: null },
        include: {
          children: {
            where: { status: 'ACTIVE', deletedAt: null },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
      })
    );

    if (dbCategories && dbCategories.length > 0) {
      return dbCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        heroImage: cat.image || '',
        subcategories: cat.children.map((sub) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          categoryId: cat.id,
          description: sub.description || '',
          image: sub.image || undefined,
        })),
      }));
    }
  } catch (error) {
    console.warn('Database error or timeout in getCategories, falling back to mock data');
  }

  return mockCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const cat = await withDbTimeout(
      prisma.category.findFirst({
        where: { slug, deletedAt: null },
        include: {
          children: {
            where: { status: 'ACTIVE', deletedAt: null },
            orderBy: { sortOrder: 'asc' },
          },
        },
      })
    );

    if (cat) {
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        heroImage: cat.image || '',
        subcategories: cat.children.map((sub) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          categoryId: cat.id,
          description: sub.description || '',
          image: sub.image || undefined,
        })),
      };
    }
  } catch (error) {
    console.warn('Database error or timeout in getCategoryBySlug, falling back to mock data');
  }

  const mock = mockCategories.find((c) => c.slug === slug);
  return mock || null;
}

export async function getSubcategoryBySlug(
  categorySlug: string,
  subcategorySlug: string
): Promise<{ category: Category; subcategory: Subcategory } | null> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return null;

  const subcategory = category.subcategories.find((sub) => sub.slug === subcategorySlug);
  if (!subcategory) return null;

  return { category, subcategory };
}

// ADMIN SERVICE METHODS
export async function getAllCategoriesAdmin(includeDeleted = false) {
  try {
    const res = await withDbTimeout(
      prisma.category.findMany({
        where: includeDeleted ? {} : { deletedAt: null },
        include: {
          parent: true,
          children: true,
          _count: { select: { products: true } },
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      })
    );
    if (res && res.length > 0) return res;
  } catch {
    console.warn('Database error in getAllCategoriesAdmin, using fallback catalog');
  }

  return mockCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.heroImage,
    parentId: null,
    sortOrder: 1,
    status: 'ACTIVE',
    children: (c.subcategories || []).map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description,
      image: s.image,
      parentId: c.id,
      sortOrder: 1,
      status: 'ACTIVE',
    })),
    _count: { products: 12 },
  }));
}

export async function createCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  sortOrder?: number;
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  createdBy?: string;
}) {
  const finalSlug = data.slug ? data.slug : await generateUniqueSlug('category', data.name);

  return prisma.category.create({
    data: {
      name: data.name,
      slug: finalSlug,
      description: data.description,
      image: data.image,
      parentId: data.parentId || null,
      sortOrder: data.sortOrder ?? 0,
      status: data.status || 'ACTIVE',
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,
      canonicalUrl: data.canonicalUrl,
      ogImage: data.ogImage,
      createdBy: data.createdBy,
    },
  });
}

export async function updateCategory(id: string, inputData: any) {
  const rawData = { ...inputData };

  let slug = rawData.slug;
  if (rawData.name && !slug) {
    slug = await generateUniqueSlug('category', rawData.name, id);
  }

  const updateData: any = {};
  if (rawData.name !== undefined) updateData.name = rawData.name;
  if (slug !== undefined) updateData.slug = slug;
  if (rawData.description !== undefined) updateData.description = rawData.description || null;
  if (rawData.image !== undefined) updateData.image = rawData.image || null;
  if (rawData.parentId !== undefined) updateData.parentId = rawData.parentId || null;
  if (rawData.sortOrder !== undefined) updateData.sortOrder = Number(rawData.sortOrder);
  if (rawData.status !== undefined) updateData.status = rawData.status;
  if (rawData.seoTitle !== undefined) updateData.seoTitle = rawData.seoTitle || null;
  if (rawData.seoDescription !== undefined) updateData.seoDescription = rawData.seoDescription || null;
  if (rawData.seoKeywords !== undefined) updateData.seoKeywords = rawData.seoKeywords || null;
  if (rawData.canonicalUrl !== undefined) updateData.canonicalUrl = rawData.canonicalUrl || null;
  if (rawData.ogImage !== undefined) updateData.ogImage = rawData.ogImage || null;
  if (rawData.updatedBy !== undefined) updateData.updatedBy = rawData.updatedBy || null;

  return prisma.category.update({
    where: { id },
    data: updateData,
  });
}

export async function softDeleteCategory(id: string, updatedBy?: string) {
  return prisma.category.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      updatedBy,
    },
  });
}

export async function restoreCategory(id: string) {
  return prisma.category.update({
    where: { id },
    data: { deletedAt: null },
  });
}

export async function deleteCategory(id: string) {
  return softDeleteCategory(id);
}
