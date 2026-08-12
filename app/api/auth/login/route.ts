import { NextRequest } from 'next/server';
import { loginSchema } from '@/lib/validations/schemas';
import { authenticateUser } from '@/lib/services/userService';
import { createToken, setSessionCookie } from '@/lib/auth/session';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(request, 5, 60 * 1000); // 5 attempts per min
    if (!rateLimit.success) {
      return apiError('Too many login attempts. Please try again in 1 minute.', 429, 'RATE_LIMIT_EXCEEDED');
    }

    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Validation failed', 400, 'INVALID_INPUT', validation.error.format());
    }

    const { email, password } = validation.data;
    const user = await authenticateUser(email, password);

    if (!user) {
      return apiError('Invalid email or password', 401, 'UNAUTHORIZED');
    }

    const token = await createToken(user);
    const response = apiSuccess(
      {
        user,
        message: 'Login successful',
      },
      200
    );

    setSessionCookie(response, token);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
