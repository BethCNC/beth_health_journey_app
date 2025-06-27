import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If the request is for the root path, redirect to the coming-soon page
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/coming-soon', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
}; 