import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjQ5MzY0ODQyMzB9.XeB4g3E3Qb-soQw4POeiinU-lgckC24HU0tJ_d8kawY";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect all /admin routes (Frontend Pages)
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session');
    
    if (!adminSession || adminSession.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Inject Authorization Header for API Proxy requests
  if (pathname.startsWith('/api-proxy/admin')) {
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession || adminSession.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${ADMIN_JWT}`);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // If user is logged in and tries to access /login, redirect to /admin
  if (pathname === '/login') {
    const adminSession = request.cookies.get('admin_session');
    if (adminSession && adminSession.value === 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/api-proxy/:path*'],
};
