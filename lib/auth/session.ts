import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface UserSessionPayload {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SALES_EXECUTIVE';
  status: 'ACTIVE' | 'INACTIVE';
}

const COOKIE_NAME = 'admin_token';
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-jwt-key-b2b-architectural-hardware-2026-secure'
);

/**
 * Creates a JWT token for the user session.
 */
export async function createToken(payload: UserSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

/**
 * Verifies a JWT token and returns the payload if valid.
 */
export async function verifyToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    return verified.payload as unknown as UserSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Sets the admin authentication cookie in the response.
 */
export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Clears the admin authentication cookie.
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete({
    name: COOKIE_NAME,
    path: '/',
  });
}

/**
 * Gets the authenticated user session from Next.js cookies (Server Components / Route Handlers).
 */
export async function getSession(): Promise<UserSessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Gets the token from incoming HTTP Request (Middleware or Route Handlers).
 */
export async function getSessionFromRequest(request: NextRequest): Promise<UserSessionPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Verifies if the authenticated session has one of the allowed roles.
 */
export async function requireRole(
  allowedRoles: ('SUPER_ADMIN' | 'ADMIN' | 'SALES_EXECUTIVE')[]
): Promise<UserSessionPayload | null> {
  const session = await getSession();
  if (!session) return null;
  if (!allowedRoles.includes(session.role)) return null;
  return session;
}
