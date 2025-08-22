"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ImageGallery } from "@/components/ui/image-gallery";
import { api } from "@/lib/api";
import {
  formatCurrency,
  formatDate,
  translateOrderStatus,
} from "@/lib/order-utils";
import { isAxiosError } from "axios";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PedidosPage() {
  const [orders, setOrders] = useState<
    {
      id: string;
      code: number;
      name: string;
      createdAt: string;
      status: {
        name: string;
      };
      property: {
        description: string;
        addressCity: string;
        addressState: string;
        price: number;
        propertyImage: {
          image: {
            id: string;
            url: string;
            description: string;
          };
        }[];
      };
    }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/pedido");
      setOrders(response.data);
    } catch (error) {
      toast.error("Erro ao buscar pedidos");
      setOrders([]);
    }
    setLoading(false);
  };

  const deleteOrder = async (id: string) => {
    try {
      await api.delete(`/api/pedido/${id}`);
      fetchOrders();
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 403) {
          toast.error("Você não tem permissão para cancelar este pedido.");
          return;
        }

        if (error.response?.status === 401) {
          toast.error(
            "Não é possivel cancelar um pedido que não esta pendente."
          );
          return;
        }
      } else {
        toast.error("Erro ao cancelar pedido");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Carregando pedidos...</p>
      ) : (
        <>
          {orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id} className="shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">
                        {order.name || `Pedido #${order.code}`}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Código: {order.code}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Criado em: {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {translateOrderStatus(order.status.name)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-sm mb-1">Imóvel</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.property.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.property.addressCity} -{" "}
                        {order.property.addressState}
                      </p>
                      <p className="text-sm font-medium">
                        {formatCurrency(order.property.price)}
                      </p>
                      {order.property.propertyImage.length > 0 && (
                        <div className="mt-2">
                          <ImageGallery
                            images={order.property.propertyImage.map(
                              (img) => img.image
                            )}
                            trigger={
                              <Button variant="outline" size="sm">
                                Ver {order.property.propertyImage.length}{" "}
                                imagem(ns)
                              </Button>
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Link href={`/app/pedido/${order.id}`}>
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalhes
                        </Button>
                      </Link>
                      {order.status.name === "PENDING" && (
                        <Link href={`/app/pedido/${order.id}/editar`}>
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                        </Link>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteOrder(order.id)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
          )}
        </>
      )}
    </div>
  );
}
