import prisma, { withDbTimeout } from '@/lib/prisma';
import { products as mockProducts } from '@/data/products';
import { Product, ProductFilters } from '@/lib/types';
import { ProductStatus } from '@prisma/client';
import { generateUniqueSlug } from '@/lib/utils/slug';
import { getCanonicalUrl } from '@/lib/seo/schema';

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
    finish: p.finishes ? p.finishes.join(', ') : '',
    shortDescription: p.shortDescription,
    description: p.description,
    featured: p.featured,
    status: 'AVAILABLE',
    images: (p.images || []).map((img, i) => ({ url: img, isFeatured: i === 0, sortOrder: i + 1 })),
    variants: [],
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
      canonicalUrl: data.canonicalUrl || getCanonicalUrl(`/product/${finalSlug}`),
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
      variants: Array.isArray(data.variants) && data.variants.length > 0
        ? {
            create: data.variants.map((v, idx) => ({
              size: v.size || null,
              finish: v.finish || null,
              material: v.material || null,
              sku: v.sku && v.sku.trim() ? v.sku.trim() : (data.sku ? `${data.sku}-V${idx + 1}` : null),
              variantCode: v.variantCode || null,
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

// Server-side base64 image uploader helper
async function handleBase64Upload(dataUrl: string): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);

      const mimeTypeMatch = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';
      const ext = mimeType.split('/')[1] || 'png';

      const base64Data = dataUrl.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

      const { data, error } = await supabase.storage
        .from('catalog-images')
        .upload(fileName, buffer, { contentType: mimeType, upsert: true });

      if (!error && data) {
        const { data: publicData } = supabase.storage.from('catalog-images').getPublicUrl(fileName);
        return publicData.publicUrl;
      }
    } catch (e) {
      console.warn('[BASE64_UPLOAD_ERROR]', e);
    }
  }
  return dataUrl;
}

export async function updateProduct(id: string, inputData: any) {
  const rawData = { ...inputData };

  // 1. Generate unique slug if name changed and slug not explicitly set
  let slug = rawData.slug;
  if (rawData.name && !slug) {
    slug = await generateUniqueSlug('product', rawData.name, id);
  }

  // 2. Process Images nested relation write
  let imagesNested: any = undefined;
  if (Array.isArray(rawData.images)) {
    const processedImages: { url: string; altText?: string; isFeatured?: boolean; sortOrder?: number }[] = [];

    for (let i = 0; i < rawData.images.length; i++) {
      const img = rawData.images[i];
      let url = typeof img === 'string' ? img : img?.url;

      if (url && url.startsWith('data:image/')) {
        url = await handleBase64Upload(url);
      }

      if (url) {
        processedImages.push({
          url,
          altText: typeof img === 'object' && img.altText ? img.altText : rawData.name,
          isFeatured: typeof img === 'object' && img.isFeatured !== undefined ? !!img.isFeatured : i === 0,
          sortOrder: typeof img === 'object' && img.sortOrder !== undefined ? Number(img.sortOrder) : i + 1,
        });
      }
    }

    imagesNested = {
      deleteMany: {},
      create: processedImages.map((img) => ({
        url: img.url,
        altText: img.altText || null,
        isFeatured: img.isFeatured ?? false,
        sortOrder: img.sortOrder ?? 0,
      })),
    };
  }

  // 3. Process Variants nested relation write
  let variantsNested: any = undefined;
  if (Array.isArray(rawData.variants)) {
    if (rawData.variants.length === 0) {
      variantsNested = { deleteMany: {} };
    } else {
      const processedVariants = rawData.variants.map((v: any, idx: number) => ({
        size: v.size || null,
        finish: v.finish || null,
        material: v.material || null,
        sku: v.sku && v.sku.trim() ? v.sku.trim() : (rawData.sku ? `${rawData.sku}-V${idx + 1}` : null),
        variantCode: v.variantCode || null,
        sortOrder: v.sortOrder !== undefined ? Number(v.sortOrder) : idx,
        status: v.status || 'ACTIVE',
      }));

      variantsNested = {
        deleteMany: {},
        create: processedVariants,
      };
    }
  }

  // 4. Process Collections nested relation write
  let collectionsNested: any = undefined;
  const rawCollectionIds = rawData.collectionIds || rawData.collections;
  if (Array.isArray(rawCollectionIds)) {
    const collectionIds: string[] = rawCollectionIds
      .map((c: any) => (typeof c === 'string' ? c : c.collectionId || c.id))
      .filter(Boolean);

    collectionsNested = {
      deleteMany: {},
      create: collectionIds.map((cid) => ({
        collectionId: cid,
      })),
    };
  }

  // 5. Styles & Specifications JSON
  let stylesJson: any = undefined;
  if (rawData.styles !== undefined) {
    if (Array.isArray(rawData.styles)) {
      stylesJson = JSON.stringify(rawData.styles);
    } else if (typeof rawData.styles === 'string') {
      stylesJson = rawData.styles;
    } else {
      stylesJson = JSON.stringify(rawData.styles);
    }
  }

  let specsJson: any = undefined;
  if (rawData.specifications !== undefined) {
    if (typeof rawData.specifications === 'string') {
      specsJson = rawData.specifications;
    } else if (typeof rawData.specifications === 'object') {
      specsJson = JSON.stringify(rawData.specifications);
    }
  }

  // 6. Status & PublishedAt
  const status = rawData.status || undefined;
  let publishedAt: Date | undefined = undefined;
  if (status === 'PUBLISHED' || status === ProductStatus.PUBLISHED) {
    publishedAt = new Date();
  }

  // 7. Construct clean updateData matching Prisma ProductUpdateInput EXACTLY
  const updateData: any = {};

  if (rawData.name !== undefined) updateData.name = rawData.name;
  if (slug !== undefined) updateData.slug = slug;
  if (rawData.sku !== undefined) updateData.sku = rawData.sku;
  if (rawData.productCode !== undefined) updateData.productCode = rawData.productCode;
  if (rawData.categoryId !== undefined) updateData.categoryId = rawData.categoryId;
  if (rawData.subcategoryId !== undefined) updateData.subcategoryId = rawData.subcategoryId || null;
  if (rawData.shortDescription !== undefined) updateData.shortDescription = rawData.shortDescription || null;
  if (rawData.description !== undefined) updateData.description = rawData.description || null;
  if (rawData.material !== undefined) updateData.material = rawData.material;
  if (rawData.finish !== undefined) updateData.finish = rawData.finish || null;
  if (rawData.weight !== undefined) updateData.weight = rawData.weight || null;
  if (rawData.dimensions !== undefined) updateData.dimensions = rawData.dimensions || null;
  if (stylesJson !== undefined) updateData.styles = stylesJson;
  if (specsJson !== undefined) updateData.specifications = specsJson;
  if (rawData.featured !== undefined) updateData.featured = Boolean(rawData.featured);
  if (rawData.sortOrder !== undefined) updateData.sortOrder = Number(rawData.sortOrder);
  if (status !== undefined) updateData.status = status;
  if (publishedAt !== undefined) updateData.publishedAt = publishedAt;

  if (rawData.seoTitle !== undefined) updateData.seoTitle = rawData.seoTitle || null;
  if (rawData.seoDescription !== undefined) updateData.seoDescription = rawData.seoDescription || null;
  if (rawData.seoKeywords !== undefined) updateData.seoKeywords = rawData.seoKeywords || null;
  if (slug) {
    updateData.canonicalUrl = rawData.canonicalUrl || getCanonicalUrl(`/product/${slug}`);
  }
  if (rawData.ogImage !== undefined) updateData.ogImage = rawData.ogImage || null;
  if (rawData.updatedBy !== undefined) updateData.updatedBy = rawData.updatedBy || null;

  if (imagesNested !== undefined) updateData.images = imagesNested;
  if (variantsNested !== undefined) updateData.variants = variantsNested;
  if (collectionsNested !== undefined) updateData.collections = collectionsNested;

  // MANDATORY LOGGING BEFORE PRISMA UPDATE:
  console.log(JSON.stringify(updateData, null, 2));

  return prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      subcategory: true,
      images: true,
      variants: true,
      collections: { include: { collection: true } },
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
