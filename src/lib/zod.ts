import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "O e-mail é obrigatório" })
    .min(1, "O e-mail é obrigatório")
    .email("E-mail inválido"),
  password: z
    .string({ required_error: "A senha é obrigatória" })
    .min(1, "A senha é obrigatória"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z
      .string({ required_error: "O e-mail é obrigatório" })
      .min(1, "O e-mail é obrigatório")
      .email("E-mail inválido"),
    password: z
      .string({ required_error: "A senha é obrigatória" })
      .min(1, "A senha é obrigatória")
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(1, "A confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
  });
