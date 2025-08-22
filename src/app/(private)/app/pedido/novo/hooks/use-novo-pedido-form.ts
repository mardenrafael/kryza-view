import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useNovoPedidoForm() {
  const router = useRouter();
  const form = useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: any, images?: any[]) {
    const dataWithImages = {
      ...data,
      images: images || [],
    };

    try {
      const res = await api.post("/api/pedido", dataWithImages);

      if (res?.status !== 201) {
        toast.error("Erro ao criar pedido");
        return;
      }

      toast.success("Pedido criado com sucesso");
      router.push("/app/pedido");
    } catch (error) {
      toast.error("Erro ao criar pedido");
    }
  }

  return {
    form,
    onSubmit,
    control: form.control,
    isLoading: form.formState.isSubmitting,
  };
}
