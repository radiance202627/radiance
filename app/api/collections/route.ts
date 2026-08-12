import { NextRequest } from 'next/server';
import { getCollections, getAllCollectionsAdmin, createCollection } from '@/lib/services/collectionService';
import { collectionSchema } from '@/lib/validations/schemas';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    if (mode === 'admin') {
      const collections = await getAllCollectionsAdmin();
      return apiSuccess(collections);
    }

    const collections = await getCollections();
    return apiSuccess(collections);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = collectionSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Validation failed', 400, 'INVALID_INPUT', validation.error.format());
    }

    const collection = await createCollection(validation.data);
    return apiSuccess(collection, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
