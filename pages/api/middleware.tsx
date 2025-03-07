import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token'); // Replace with your actual cookie name
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login if not authenticated
  }
  return NextResponse.next(); // Proceed if the user is authenticated
}

export const config = {
  matcher: ['/shop', '/cart', '/checkout'], // Apply middleware to these pages
};