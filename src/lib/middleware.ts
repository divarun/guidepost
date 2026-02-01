import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const publicPaths = ['/', '/explore', '/auth/login', '/auth/register'];
const apiPublicPaths = ['/api/auth/login', '/api/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow API public paths
  if (apiPublicPaths.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    // Redirect to login for protected pages
    if (!pathname.startsWith('/api/')) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    // Return 401 for API routes
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    if (!pathname.startsWith('/api/')) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }

  // Role-based route protection
  if (pathname.startsWith('/student') && payload.role !== 'STUDENT') {
    return pathname.startsWith('/api/')
      ? NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      : NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/parent') && payload.role !== 'PARENT') {
    return pathname.startsWith('/api/')
      ? NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      : NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
    return pathname.startsWith('/api/')
      ? NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      : NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};