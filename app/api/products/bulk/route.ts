import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ProductStatus } from '@prisma/client';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return apiError('Product IDs array is required', 400, 'INVALID_INPUT');
    }

    if (action === 'publish') {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { status: ProductStatus.PUBLISHED, publishedAt: new Date() },
      });
      return apiSuccess({ message: `Successfully published ${ids.length} product(s)` });
    }

    if (action === 'draft') {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { status: ProductStatus.DRAFT },
      });
      return apiSuccess({ message: `Successfully set ${ids.length} product(s) to draft` });
    }

    if (action === 'delete') {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { deletedAt: new Date() },
      });
      return apiSuccess({ message: `Successfully moved ${ids.length} product(s) to trash` });
    }

    if (action === 'restore') {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { deletedAt: null },
      });
      return apiSuccess({ message: `Successfully restored ${ids.length} product(s)` });
    }

    return apiError('Invalid bulk action', 400, 'INVALID_ACTION');
  } catch (error) {
    return handleApiError(error);
  }
}
