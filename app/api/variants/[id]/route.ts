import { NextRequest } from 'next/server';
import { updateVariant, deleteVariant } from '@/lib/services/variantService';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id: params.id },
      include: { product: true },
    });

    if (!variant) {
      return apiError('Variant not found', 404, 'NOT_FOUND');
    }

    return apiSuccess(variant);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await updateVariant(params.id, body);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteVariant(params.id);
    return apiSuccess({ message: 'Variant deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
