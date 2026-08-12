import { NextRequest } from 'next/server';
import { getAllQuoteRequests, createQuoteRequest } from '@/lib/services/quoteService';
import { quoteRequestSchema } from '@/lib/validations/schemas';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    const quotes = await getAllQuoteRequests();
    return apiSuccess(quotes);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(request, 10, 60 * 1000); // 10 RFQs per min
    if (!rateLimit.success) {
      return apiError('Too many quote requests. Please wait a minute before submitting again.', 429, 'RATE_LIMIT_EXCEEDED');
    }

    const body = await request.json();
    const validation = quoteRequestSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Validation failed', 400, 'INVALID_INPUT', validation.error.format());
    }

    const quote = await createQuoteRequest(validation.data as any);
    return apiSuccess(quote, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
