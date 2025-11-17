import type { NextAuthConfig } from 'next-auth';
import { ROLES } from './constants';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedRoutes = ['/account', '/cart', '/order-success'];
      const adminRoutes = ['/admin'];
      const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route));
      const isAdminRoute = adminRoutes.some(route => nextUrl.pathname.startsWith(route));

      if (!isLoggedIn && (isProtectedRoute || isAdminRoute)) {
        return false; // Redirect to login
      }
      
      if (isLoggedIn && isAdminRoute && auth.user?.role !== ROLES.ADMIN) {
        return Response.redirect(new URL('/shop', nextUrl));
      }
      
      if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/register')) {
        return Response.redirect(new URL('/shop', nextUrl));
      }

      return true;
    },
    jwt: ({ token, user }) => {
        console.log('jwt callback', { token, user });
        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.accessToken = user.accessToken;
        }
        return token;
    },
    session: ({ session, token }) => {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
        }
        session.accessToken = token.accessToken as string;
        return session;
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
