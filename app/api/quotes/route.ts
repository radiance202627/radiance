import { NextRequest } from 'next/server';
import { getAllQuoteRequests, createQuoteRequest } from '@/lib/services/quoteService';
import { quoteRequestSchema } from '@/lib/validations/schemas';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    console.log('[API/QUOTES] GET request received. Querying PostgreSQL...');
    const quotes = await getAllQuoteRequests();
    console.log(`[API/QUOTES] Returning ${quotes.length} quotes from PostgreSQL.`);
    return apiSuccess(quotes);
  } catch (error) {
    console.error('[API/QUOTES] GET Error:', error);
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API/QUOTES] 1. Incoming RFQ POST request received');
    const rateLimit = checkRateLimit(request, 10, 60 * 1000); // 10 RFQs per min
    if (!rateLimit.success) {
      console.warn('[API/QUOTES] Rate limit exceeded');
      return apiError('Too many quote requests. Please wait a minute before submitting again.', 429, 'RATE_LIMIT_EXCEEDED');
    }

    const body = await request.json();
    console.log('[API/QUOTES] Incoming Request Body:', JSON.stringify(body, null, 2));

    const validation = quoteRequestSchema.safeParse(body);
    if (!validation.success) {
      const formattedErrors = validation.error.format();
      console.error('[API/QUOTES] Zod Validation Failed!');
      console.error('[API/QUOTES] Formatted Error Details:', JSON.stringify(formattedErrors, null, 2));
      return apiError('Validation failed', 400, 'INVALID_INPUT', formattedErrors);
    }
    console.log('[API/QUOTES] Request validation passed successfully.');

    console.log('[API/QUOTES] 4. Calling createQuoteRequest()...');
    const quote = await createQuoteRequest(validation.data as any);
    console.log(`[API/QUOTES] 5. Transaction complete. Created quote in PostgreSQL with DB ID: ${quote.id}`);

    return apiSuccess(quote, 201);
  } catch (error) {
    console.error('[API/QUOTES] ERROR in POST /api/quotes:', error);
    return handleApiError(error);
  }
}

