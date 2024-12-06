import { PrismaClient } from "@prisma/client";
import NextAuth, { User } from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials?.username && credentials.password) {
          try {
            const user = await prisma.admin.findFirst({
              where: {
                username: credentials.username,
              },
            });

            if (!user) {
              return null;
            }

            const comparisonResult = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (!comparisonResult) {
              return null;
            }

            return { id: user.id, email: user.username } as User;
          } catch (error) {
            console.error("Error during authentication:", error);
            return null;
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    // signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.email = token.username as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
