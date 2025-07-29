
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '@/lib/mongodb';
import { compare } from 'bcryptjs';
import type { User as DbUser } from '@/lib/types';
import type { NextAuthConfig } from 'next-auth';
import { getDb } from './lib/product-service';
import { ObjectId } from 'mongodb';

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
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.picture = session.user.image;
      }

      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        // Fetch full user object on initial sign in to include profile image
        const db = await getDb();
        const usersCollection = db.collection<DbUser>("users");
        const dbUser = await usersCollection.findOne({ _id: new ObjectId(user.id) });
        if (dbUser) {
          token.picture = dbUser.profileImage;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (session.user) {
        session.user.isAdmin = token.isAdmin as boolean;
        if(token.picture) {
          session.user.image = token.picture as string;
        }
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
          image: user.profileImage,
          isAdmin: user.isAdmin || false,
        };
      }
    })
  ],
} satisfies NextAuthConfig;


export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
