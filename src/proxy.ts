import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authConfig } from './lib/auth.config';
import NextAuth from 'next-auth';

const { auth: proxy } = NextAuth(authConfig);

export default proxy;

export const config = {
  // Match all routes except for static files and the API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
