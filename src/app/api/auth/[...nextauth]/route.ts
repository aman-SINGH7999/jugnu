// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// 1️⃣ Auth options
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: { params: { scope: "public_profile,email" } },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as any).id || (user as any)._id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.id;
      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log("NEXTAUTH signIn event:", message);
    },
    async createUser(user) {
      console.log("NEXTAUTH createUser event:", user);
    },
  },
};

// 2️⃣ App Router handler wrapper
const handler = (req: NextRequest) => {
  return NextAuth(req as unknown as Request, new Response(), authOptions);
};

// 3️⃣ Explicitly export GET and POST for App Router
export { handler as GET, handler as POST };
