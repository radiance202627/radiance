import { NextRequest } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const tracker = new Map<string, RateLimitStore>();

/**
 * In-memory sliding window rate limiter for API protection.
 * @param req NextRequest
 * @param maxRequests Maximum allowed requests per window
 * @param windowMs Time window in milliseconds (default: 1 minute)
 */
export function checkRateLimit(
  req: NextRequest,
  maxRequests = 10,
  windowMs = 60 * 1000
): { success: boolean; limit: number; remaining: number } {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous_ip';
  const key = `${req.nextUrl.pathname}:${ip}`;
  const now = Date.now();

  const record = tracker.get(key);

  if (!record || now > record.resetTime) {
    tracker.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, limit: maxRequests, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { success: false, limit: maxRequests, remaining: 0 };
  }

  record.count += 1;
  tracker.set(key, record);
  return { success: true, limit: maxRequests, remaining: maxRequests - record.count };
}
