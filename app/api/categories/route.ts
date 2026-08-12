import { NextRequest } from 'next/server';
import { getCategories, getAllCategoriesAdmin, createCategory } from '@/lib/services/categoryService';
import { categorySchema } from '@/lib/validations/schemas';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    if (mode === 'admin') {
      const categories = await getAllCategoriesAdmin();
      return apiSuccess(categories);
    }

    const categories = await getCategories();
    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
      return apiError('Validation failed', 400, 'INVALID_INPUT', validation.error.format());
    }

    const category = await createCategory(validation.data);
    return apiSuccess(category, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
