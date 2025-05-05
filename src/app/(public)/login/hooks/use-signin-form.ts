import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function useSignInForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });
  async function onSubmit(data: z.infer<typeof signInSchema>) {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (res?.error) {
      toast.error("E-mail ou senha inválidos!");
      return;
    }

    toast.success("Login realizado com sucesso!");
    router.push("/");
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    control: form.control,
  };
}
