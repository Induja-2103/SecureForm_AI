import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUserCredentials } from "@/lib/users";

const prismaAdapter = PrismaAdapter(prisma) as any;
const customAdapter = {
  ...prismaAdapter,
  linkAccount: (account: any) => {
    delete account.refresh_token_expires_in;
    return prismaAdapter.linkAccount(account);
  }
};

export const authOptions: NextAuthOptions = {
  adapter: customAdapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Username & Password",
      credentials: {
        username: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Please enter username/email and password.");
        }
        const user = await verifyUserCredentials(credentials.username, credentials.password);
        if (!user) {
          throw new Error("Invalid username/email or password.");
        }
        return {
          id: user.id,
          name: user.name || user.username,
          email: user.email,
        };
      },
    }),
    CredentialsProvider({
      id: "demo-login",
      name: "Demo Account",
      credentials: {},
      async authorize() {
        return {
          id: "user_induja_verified",
          name: "Induja S",
          email: "induja2103@gmail.com",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.sub;
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
      }
      // @ts-ignore
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
