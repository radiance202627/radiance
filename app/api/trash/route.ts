import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    const deletedProducts = await prisma.product.findMany({
      where: { deletedAt: { not: null } },
      include: { category: true },
      orderBy: { updatedAt: 'desc' },
    });

    const deletedCategories = await prisma.category.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { updatedAt: 'desc' },
    });

    const deletedCollections = await prisma.collection.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { updatedAt: 'desc' },
    });

    return apiSuccess({
      products: deletedProducts,
      categories: deletedCategories,
      collections: deletedCollections,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entity, action, id } = body;

    if (!entity || !action || !id) {
      return apiError('entity, action, and id are required', 400, 'INVALID_INPUT');
    }

    if (action === 'restore') {
      if (entity === 'product') {
        await prisma.product.update({ where: { id }, data: { deletedAt: null } });
      } else if (entity === 'category') {
        await prisma.category.update({ where: { id }, data: { deletedAt: null } });
      } else if (entity === 'collection') {
        await prisma.collection.update({ where: { id }, data: { deletedAt: null } });
      }
      return apiSuccess({ message: `${entity} restored successfully` });
    }

    if (action === 'purge') {
      if (entity === 'product') {
        await prisma.product.delete({ where: { id } });
      } else if (entity === 'category') {
        await prisma.category.delete({ where: { id } });
      } else if (entity === 'collection') {
        await prisma.collection.delete({ where: { id } });
      }
      return apiSuccess({ message: `${entity} permanently deleted` });
    }

    return apiError('Invalid trash action', 400, 'INVALID_ACTION');
  } catch (error) {
    return handleApiError(error);
  }
}
