import { NextRequest } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/services/productService';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        subcategory: true,
        images: true,
        variants: true,
        collections: { include: { collection: true } },
      },
    });

    if (!product) {
      return apiError('Product not found', 404, 'NOT_FOUND');
    }

    return apiSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await updateProduct(params.id, body);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteProduct(params.id);
    return apiSuccess({ message: 'Product deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
