// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
  clientId: process.env.FACEBOOK_CLIENT_ID!,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
  authorization: {
    params: {
      scope: "public_profile,email",
    },
  },
})

  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  events: {
    async signIn(message) {
      console.log("NEXTAUTH event signIn:", message);
    },
    async createUser(user) {
      console.log("NEXTAUTH event createUser:", user);
    },
  },
  callbacks: {
    async jwt({ token, user,  }) {
      // On sign-in, NextAuth will set user from DB
      if (user) {
        token.id = (user as any).id || (user as any)._id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
    // optional: restrict signups by email domain
    // async signIn({ user, account, profile }) { return true }
  },
  // optional: pages: { signIn: '/auth/signin' }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
