import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/session';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function POST() {
  try {
    const response = apiSuccess({ message: 'Logged out successfully' });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
