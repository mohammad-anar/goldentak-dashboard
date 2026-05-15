import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Redirect root path to dashboard
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}
 
// Only run middleware on the root path
export const config = {
  matcher: '/',
}
