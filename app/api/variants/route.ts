import { NextRequest } from 'next/server';
import { getVariantsByProduct, createVariant } from '@/lib/services/variantService';
import { variantSchema } from '@/lib/validations/schemas';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return apiError('productId query parameter is required', 400, 'MISSING_PARAM');
    }

    const variants = await getVariantsByProduct(productId);
    return apiSuccess(variants);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = variantSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Validation failed', 400, 'INVALID_INPUT', validation.error.format());
    }

    if (!validation.data.productId) {
      return apiError('productId is required for creating a variant', 400, 'MISSING_PARAM');
    }

    const variant = await createVariant(validation.data as any);
    return apiSuccess(variant, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
