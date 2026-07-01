import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session');
    
    if (!adminSession || adminSession.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
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
  matcher: ['/admin/:path*', '/login'],
};
