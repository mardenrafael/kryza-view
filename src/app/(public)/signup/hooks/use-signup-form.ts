import { api } from "@/lib/api";
import { signUpSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function useSignUpForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });
  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    try {
      const res = await api.post("api/auth/signup", data);

      if (res?.status !== 201) {
        toast.error("Erro ao cadastrar usuário!");
        return;
      }

      toast.success("Cadastro realizado com sucesso!");
      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erro ao cadastrar usuário!");
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    control: form.control,
    isLoading: form.formState.isSubmitting,
  };
}
