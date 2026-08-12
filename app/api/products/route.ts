import { NextRequest } from 'next/server';
import { getProducts, createProduct } from '@/lib/services/productService';
import { productSchema } from '@/lib/validations/schemas';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const subcategorySlug = searchParams.get('subcategorySlug') || undefined;
    const material = searchParams.get('material') || undefined;
    const finish = searchParams.get('finish') || undefined;
    const collectionSlug = searchParams.get('collectionSlug') || undefined;
    const searchQuery = searchParams.get('q') || searchParams.get('searchQuery') || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || undefined;

    const products = await getProducts({
      categorySlug,
      subcategorySlug,
      material,
      finish,
      collectionSlug,
      searchQuery,
      sortBy,
    });

    return apiSuccess(products);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Validation failed', 400, 'INVALID_INPUT', validation.error.format());
    }

    const product = await createProduct(validation.data as any);
    return apiSuccess(product, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
