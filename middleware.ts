import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const session = await getSessionFromRequest(request);

    // If user is NOT logged in and trying to access an admin page (not login), redirect to /admin/login
    if (!session && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If user IS logged in and trying to access /admin/login, redirect to /admin/dashboard
    if (session && isLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
