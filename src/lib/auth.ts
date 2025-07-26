import { signInSchema } from "@/lib/zod";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { isValidHash } from "./crypto";
import PrismaInstance from "./prisma";
import { getSubdomain } from "./utils";

declare module "next-auth" {
  interface Session {
    tenantId: string | null;
  }

  interface User {
    tenantId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId: string | null;
  }
}

export const { auth, handlers, signIn } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "Seu email",
        },
        password: {
          type: "password",
          label: "Senha",
          placeholder: "Sua senha",
        },
      },
      authorize: async (credentials, req: Request) => {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );
          const host = req.headers.get("host");
          const subdomain = getSubdomain(host);

          if (!subdomain) return null;

          const tenant = await PrismaInstance.tenant.findUnique({
            where: {
              slug: subdomain,
            },
          });

          if (!tenant) return null;

          const user = await PrismaInstance.user.findFirst({
            where: {
              email,
              tenantId: tenant.id,
            },
          });

          console.log(tenant.id);

          if (!user) return null;

          const isPasswordValid = await isValidHash(password, user.password);
          if (!isPasswordValid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            tenantId: user.tenantId,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = user.tenantId;
      }

      return token;
    },
    async session({ session, token }) {
      session.tenantId = token.tenantId;
      return session;
    },
  },
});
