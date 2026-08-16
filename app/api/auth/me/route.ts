import { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/session';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return apiError('Not authenticated', 401, 'UNAUTHORIZED');
    }
    return apiSuccess({ user: session });
  } catch (error) {
    return handleApiError(error);
  }
}
