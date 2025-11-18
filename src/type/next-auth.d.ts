import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * The shape of the user object returned in the `authorize` callback
   */
  interface User {
    role?: string | null;
    accessToken?: string | null;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role?: string | null;
    } & DefaultSession['user']; // Keep the default user properties
    accessToken?: string | null; // Add custom accessToken to the session root
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback */
  interface JWT {
    role?: string | null;
    accessToken?: string | null;
  }
}