import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect all /admin routes (Frontend Pages)
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token');
    
    if (!adminToken || adminToken.value.trim() === '') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Inject Authorization Header for API Proxy requests
  if (pathname.startsWith('/api-proxy/admin')) {
    // Allow login to pass through without token
    if (pathname === '/api-proxy/admin/login') {
      return NextResponse.next();
    }

    const adminToken = request.cookies.get('admin_token');
    if (!adminToken || adminToken.value.trim() === '') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${adminToken.value}`);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // If user is logged in and tries to access /login, redirect to /admin
  if (pathname === '/login') {
    const adminToken = request.cookies.get('admin_token');
    if (adminToken && adminToken.value.trim() !== '') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/login', '/api-proxy/:path*'],
};