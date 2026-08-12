import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  } | null;
}

/**
 * Returns a standardized successful API response.
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
    },
    { status }
  );
}

/**
 * Returns a standardized error API response.
 */
export function apiError(
  message: string,
  status: number = 400,
  code?: string,
  details?: unknown
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: {
        message,
        code,
        details,
      },
    },
    { status }
  );
}

/**
 * Helper to catch and format API route errors cleanly.
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse<null>> {
  console.error('API Error:', error);
  if (error instanceof Error) {
    return apiError(error.message, 500, 'INTERNAL_SERVER_ERROR');
  }
  return apiError('An unexpected server error occurred', 500, 'UNKNOWN_ERROR');
}
