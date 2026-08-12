import prisma, { withDbTimeout } from '@/lib/prisma';
import { products as mockProducts } from '@/data/products';
import { Product, ProductFilters } from '@/lib/types';
import { ProductStatus } from '@prisma/client';
import { generateUniqueSlug } from '@/lib/utils/slug';

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    const whereClause: any = {
      deletedAt: null, // Soft delete exclusion
    };

    if (filters) {
      if (filters.categorySlug) {
        whereClause.category = { slug: filters.categorySlug };
      }

      if (filters.subcategorySlug) {
        whereClause.subcategory = { slug: filters.subcategorySlug };
      }

      if (filters.material) {
        whereClause.material = { contains: filters.material, mode: 'insensitive' };
      }

      if (filters.collectionSlug) {
        whereClause.collections = {
          some: {
            collection: { slug: filters.collectionSlug },
          },
        };
      }

      if (filters.searchQuery) {
        const q = filters.searchQuery.trim();
        whereClause.OR = [
          { name: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } },
          { productCode: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { material: { contains: q, mode: 'insensitive' } },
        ];
      }
    }

    const dbProducts = await withDbTimeout(
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          subcategory: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } },
          collections: { include: { collection: true } },
        },
        orderBy:
          filters?.sortBy === 'name-asc'
            ? { name: 'asc' }
            : filters?.sortBy === 'name-desc'
            ? { name: 'desc' }
            : filters?.sortBy === 'sku'
            ? { sku: 'asc' }
            : { sortOrder: 'asc' },
      })
    );

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => mapDbProductToFrontend(p));
    }
  } catch (error) {
    console.warn('Database error or timeout in getProducts, falling back to mock data');
  }

  let result = [...mockProducts];
  if (!filters) return result;

  if (filters.categorySlug) {
    result = result.filter((p) => p.categorySlug === filters.categorySlug);
  }
  if (filters.subcategorySlug) {
    result = result.filter((p) => p.subcategorySlug === filters.subcategorySlug);
  }
  if (filters.material) {
    const matLower = filters.material.toLowerCase();
    result = result.filter((p) => p.material.toLowerCase().includes(matLower));
  }
  if (filters.finish) {
    result = result.filter((p) =>
      p.finishes.some((f) => f.toLowerCase().includes(filters.finish!.toLowerCase()))
    );
  }
  if (filters.collectionSlug) {
    result = result.filter((p) => p.collections.includes(filters.collectionSlug!));
  }
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );
  }

  return result;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const p = await withDbTimeout(
      prisma.product.findFirst({
        where: { slug, deletedAt: null },
        include: {
          category: true,
          subcategory: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } },
          collections: { include: { collection: true } },
        },
      })
    );

    if (p) {
      return mapDbProductToFrontend(p);
    }
  } catch (error) {
    console.warn('Database error or timeout in getProductBySlug, falling back to mock data');
  }

  const mock = mockProducts.find((p) => p.slug === slug);
  return mock || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const featured = await withDbTimeout(
      prisma.product.findMany({
        where: { featured: true, deletedAt: null },
        include: {
          category: true,
          subcategory: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { where: { deletedAt: null } },
          collections: { include: { collection: true } },
        },
        orderBy: { sortOrder: 'asc' },
      })
    );

    if (featured && featured.length > 0) {
      return featured.map((p) => mapDbProductToFrontend(p));
    }
  } catch (error) {
    console.warn('Database error or timeout in getFeaturedProducts, falling back to mock data');
  }

  return mockProducts.filter((p) => p.featured);
}

export async function getRelatedProducts(productId: string, categoryId: string): Promise<Product[]> {
  const allProducts = await getProducts();
  const related = allProducts.filter((p) => p.categoryId === categoryId && p.id !== productId);
  if (related.length < 3) {
    const fallback = allProducts.filter((p) => p.id !== productId);
    return fallback.slice(0, 4);
  }
  return related.slice(0, 4);
}

export async function searchProducts(query: string): Promise<Product[]> {
  return getProducts({ searchQuery: query });
}

// ADMIN SERVICE METHODS
export async function getAllProductsAdmin(includeDeleted = false) {
  try {
    const res = await withDbTimeout(
      prisma.product.findMany({
        where: includeDeleted ? {} : { deletedAt: null },
        include: {
          category: true,
          subcategory: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          collections: { include: { collection: true } },
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      })
    );
    if (res && res.length > 0) return res;
  } catch {
    console.warn('Database timeout in getAllProductsAdmin, using fallback catalog');
  }

  const mockProds = await getProducts();
  return mockProds.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    productCode: p.sku,
    categoryId: p.categoryId,
    categoryName: p.categoryName,
    material: p.material,
    finish: p.finish,
    shortDescription: p.shortDescription,
    description: p.description,
    featured: p.featured,
    status: p.inStock ? 'AVAILABLE' : 'DRAFT',
    images: (p.images || []).map((img, i) => ({ url: img, isFeatured: i === 0, sortOrder: i + 1 })),
    variants: (p.variants || []).map((v) => ({ id: v.id, size: v.size, finish: v.finish, sku: v.sku, status: 'ACTIVE' })),
    collections: p.collections || [],
  }));
}

export async function createProduct(data: {
  name: string;
  slug?: string;
  sku: string;
  productCode?: string;
  categoryId: string;
  subcategoryId?: string | null;
  shortDescription?: string;
  description?: string;
  material: string;
  finish?: string;
  weight?: string;
  dimensions?: string;
  styles?: string[];
  specifications?: Record<string, string>;
  featured?: boolean;
  sortOrder?: number;
  status?: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  createdBy?: string;
  images?: { url: string; altText?: string; isFeatured?: boolean; sortOrder?: number }[];
  variants?: { size?: string; finish?: string; material?: string; sku?: string; variantCode?: string }[];
  collectionIds?: string[];
}) {
  const finalSlug = data.slug ? data.slug : await generateUniqueSlug('product', data.name);

  return prisma.product.create({
    data: {
      name: data.name,
      slug: finalSlug,
      sku: data.sku,
      productCode: data.productCode || data.sku,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId || null,
      shortDescription: data.shortDescription,
      description: data.description,
      material: data.material,
      finish: data.finish,
      weight: data.weight,
      dimensions: data.dimensions,
      styles: data.styles ? JSON.stringify(data.styles) : undefined,
      specifications: data.specifications ? JSON.stringify(data.specifications) : undefined,
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 0,
      status: data.status || ProductStatus.AVAILABLE,
      publishedAt: data.status === ProductStatus.PUBLISHED ? new Date() : undefined,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,
      canonicalUrl: data.canonicalUrl,
      ogImage: data.ogImage,
      createdBy: data.createdBy,
      images: data.images
        ? {
            create: data.images.map((img) => ({
              url: img.url,
              altText: img.altText,
              isFeatured: img.isFeatured ?? false,
              sortOrder: img.sortOrder ?? 0,
            })),
          }
        : undefined,
      variants: data.variants
        ? {
            create: data.variants.map((v) => ({
              size: v.size,
              finish: v.finish,
              material: v.material,
              sku: v.sku,
              variantCode: v.variantCode,
            })),
          }
        : undefined,
      collections: data.collectionIds
        ? {
            create: data.collectionIds.map((cid) => ({
              collectionId: cid,
            })),
          }
        : undefined,
    },
    include: {
      category: true,
      subcategory: true,
      images: true,
      variants: true,
      collections: { include: { collection: true } },
    },
  });
}

export async function updateProduct(id: string, data: any) {
  if (data.name && !data.slug) {
    data.slug = await generateUniqueSlug('product', data.name, id);
  }

  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
      subcategory: true,
      images: true,
      variants: true,
    },
  });
}

export async function softDeleteProduct(id: string, updatedBy?: string) {
  return prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      updatedBy,
    },
  });
}

export async function restoreProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
}

export async function deleteProduct(id: string) {
  return softDeleteProduct(id);
}

// HELPER FUNCTION
function mapDbProductToFrontend(p: any): Product {
  const finishesFromVariants = p.variants?.map((v: any) => v.finish).filter(Boolean) || [];
  const sizesFromVariants = p.variants?.map((v: any) => v.size).filter(Boolean) || [];

  const baseSpecs = typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications || {};
  if (p.weight && !baseSpecs['Weight']) baseSpecs['Weight'] = p.weight;
  if (p.dimensions && !baseSpecs['Dimensions']) baseSpecs['Dimensions'] = p.dimensions;

  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    categoryId: p.categoryId,
    categoryName: p.category?.name || 'Category',
    categorySlug: p.category?.slug || 'category',
    subcategoryId: p.subcategoryId || '',
    subcategoryName: p.subcategory?.name || '',
    subcategorySlug: p.subcategory?.slug || '',
    shortDescription: p.shortDescription || '',
    description: p.description || '',
    images: p.images && p.images.length > 0 ? p.images.map((img: any) => img.url) : ['/images/placeholder.jpg'],
    material: p.material,
    finishes: Array.from(new Set([p.finish, ...finishesFromVariants])).filter(Boolean) as string[],
    sizes: Array.from(new Set(sizesFromVariants)) as string[],
    styles: typeof p.styles === 'string' ? JSON.parse(p.styles) : Array.isArray(p.styles) ? p.styles : [],
    collections: p.collections ? p.collections.map((c: any) => c.collection.slug) : [],
    specifications: baseSpecs,
    featured: p.featured,
    status: p.status === 'AVAILABLE' ? 'available' : p.status === 'CUSTOM_ORDER' ? 'custom_order' : 'discontinued',
  };
}
