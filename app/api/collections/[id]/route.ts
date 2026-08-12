import { NextRequest } from 'next/server';
import { updateCollection, deleteCollection } from '@/lib/services/collectionService';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!collection) {
      return apiError('Collection not found', 404, 'NOT_FOUND');
    }

    return apiSuccess(collection);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await updateCollection(params.id, body);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteCollection(params.id);
    return apiSuccess({ message: 'Collection deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
