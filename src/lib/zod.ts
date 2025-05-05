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
