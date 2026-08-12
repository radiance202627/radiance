import { NextRequest } from 'next/server';
import { getQuoteRequestById, updateQuoteStatus, deleteQuoteRequest } from '@/lib/services/quoteService';
import { quoteStatusUpdateSchema } from '@/lib/validations/schemas';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const quote = await getQuoteRequestById(params.id);

    if (!quote) {
      return apiError('Quote request not found', 404, 'NOT_FOUND');
    }

    return apiSuccess(quote);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validation = quoteStatusUpdateSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Validation failed', 400, 'INVALID_INPUT', validation.error.format());
    }

    const { status, notes } = validation.data;
    const updated = await updateQuoteStatus(params.id, status, notes);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteQuoteRequest(params.id);
    return apiSuccess({ message: 'Quote request deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
