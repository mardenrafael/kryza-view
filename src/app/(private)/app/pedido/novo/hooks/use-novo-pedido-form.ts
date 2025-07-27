import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useNovoPedidoForm() {
  const router = useRouter();
  const form = useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: any, images?: any[]) {
    console.log("🚀 Hook onSubmit chamado com dados:", data);
    console.log("🖼️ Imagens no hook:", images);

    // Combina os dados do formulário com as imagens
    const dataWithImages = {
      ...data,
      images: images || [],
    };

    console.log("📦 Dados finais com imagens:", dataWithImages);

    try {
      console.log("📡 Enviando requisição para /api/pedido");
      const res = await api.post("/api/pedido", dataWithImages);

      console.log("📨 Resposta da API:", res);

      if (res?.status !== 201) {
        console.error("❌ Status da resposta não é 201:", res?.status);
        toast.error("Erro ao criar pedido");
        return;
      }

      console.log("✅ Pedido criado com sucesso");
      toast.success("Pedido criado com sucesso");
      router.push("/app/pedido");
    } catch (error) {
      console.error("❌ Erro no hook onSubmit:", error);
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
