import { NextResponse } from 'next/server'
 
export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/registration')) {
    return NextResponse.rewrite(new URL('/registration', request.url))
  }
}