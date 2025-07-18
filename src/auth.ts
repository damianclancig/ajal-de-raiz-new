
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '@/lib/mongodb';
import { compare } from 'bcryptjs';
import type { User as DbUser } from '@/lib/types';
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.isAdmin || false;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      
      if (isOnAdmin) {
        if (isLoggedIn && isAdmin) return true;
        return false;
      } 
      
      if (isLoggedIn && (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register'))) {
         return Response.redirect(new URL('/', nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (session.user) {
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const client = await clientPromise;
        const db = client.db("ajal-de-raiz");
        const usersCollection = db.collection<DbUser>("users");

        const user = await usersCollection.findOne({ email: credentials.email as string });
        
        if (!user || !user.password) {
          return null;
        }

        const isMatch = await compare(credentials.password as string, user.password);
        
        if (!isMatch) {
          return null;
        }
        
        return { 
          id: user._id.toString(), 
          email: user.email, 
          name: user.name,
          isAdmin: user.isAdmin || false,
        };
      }
    })
  ],
} satisfies NextAuthConfig;


export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
