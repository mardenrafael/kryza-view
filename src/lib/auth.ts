import { isValidHash } from "@/lib/crypto";
import { getLoggerContext } from "@/lib/logger";
import PrismaInstance from "@/lib/prisma";
import { getSubdomain } from "@/lib/utils";
import { signInSchema } from "@/lib/zod";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";

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
        const log = getLoggerContext(req);
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );
          const host = req.headers.get("host");
          const subdomain = getSubdomain(host);

          if (!subdomain) {
            log.warn("Subdomain not found in request headers");
            return null;
          }

          const tenant = await PrismaInstance.tenant.findUnique({
            where: {
              slug: subdomain,
            },
          });

          if (!tenant) {
            log.warn(`Tenant not found for subdomain: ${subdomain}`);
            return null;
          }

          const user = await PrismaInstance.user.findFirst({
            where: {
              email,
              tenantId: tenant.id,
            },
          });

          if (!user) {
            log.warn(
              `User not found for email: ${email} in tenant: ${tenant.slug}`
            );
            return null;
          }

          const isPasswordValid = await isValidHash(password, user.password);
          if (!isPasswordValid) {
            log.warn(`Invalid password for user ${email}`);
            return null;
          }

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
