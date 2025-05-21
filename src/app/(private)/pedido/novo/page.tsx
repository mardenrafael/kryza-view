"use client";

import { Form } from "@/components/ui/form";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function PedidoNovoPage() {
  const router = useRouter();
  const form = useForm();

  const createOrder = async () => {
    try {
      const response = await api.post("/api/orders", {
        userId: "USER_ID_PLACEHOLDER",
        statusId: "STATUS_ID_PLACEHOLDER",
      });
      console.log("Order created:", response.data);
      router.push("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold">Criar novo pedido</h1>
      <p>Preencha os detalhes do pedido e clique em "Criar Pedido".</p>
      <Form {...form}>
        <form>
          <div className="space-y-4"></div>
        </form>
      </Form>
    </>
  );
}
