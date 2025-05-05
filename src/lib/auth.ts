import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import { ZodError } from "zod";

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
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          console.log(email);
          console.log(password);

          if (email === "admin@admin.com" && password === "admin") {
            return {
              id: "1",
              name: "Admin",
              email: "admin@admin.com",
            };
          }
          return null;
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
  },
});
