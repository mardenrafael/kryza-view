"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useEditarPedidoForm(orderId: string) {
  const router = useRouter();
  const form = useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: any) {
    try {
      const res = await api.put(`/api/pedido/${orderId}`, data);

      if (res?.status !== 200) {
        toast.error("Erro ao atualizar pedido");
        return;
      }

      toast.success("Pedido atualizado com sucesso");
      router.push(`/app/pedido/${orderId}`);
    } catch (error) {
      toast.error("Erro ao atualizar pedido");
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    control: form.control,
    isLoading: form.formState.isSubmitting,
  };
}
