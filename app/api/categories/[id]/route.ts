import { NextRequest } from 'next/server';
import { updateCategory, deleteCategory } from '@/lib/services/categoryService';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        children: true,
        parent: true,
      },
    });

    if (!category) {
      return apiError('Category not found', 404, 'NOT_FOUND');
    }

    return apiSuccess(category);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await updateCategory(params.id, body);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteCategory(params.id);
    return apiSuccess({ message: 'Category deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
