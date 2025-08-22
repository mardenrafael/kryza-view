"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ImageGallery } from "@/components/ui/image-gallery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import {
  formatCurrency,
  formatDate,
  translateOrderStatus,
} from "@/lib/order-utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Order {
  id: string;
  code: number;
  name: string;
  createdAt: string;
  status: {
    id: number;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
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
}

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Extract unique statuses from orders
  const statusOptions = Array.from(
    new Set(orders.map((order) => order.status.name))
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/pedidos");
      setOrders(response.data);
    } catch (error) {
      toast.error("Erro ao carregar pedidos");
      setOrders([]);
    }
    setLoading(false);
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status.name === statusFilter);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Pedidos</h1>
          <p className="text-muted-foreground mt-1">
            Visualize e gerencie todos os pedidos do seu tenant
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total de pedidos</p>
          <p className="text-2xl font-bold">{filteredOrders.length}</p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="statusFilter" className="font-medium text-sm">
          Filtrar por situação:
        </label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {translateOrderStatus(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando pedidos...</p>
        </div>
      ) : (
        <>
          {filteredOrders.length > 0 ? (
            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold mb-1">
                          {order.name || `Pedido #${order.code}`}
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p>Código: {order.code}</p>
                            <p>Criado em: {formatDate(order.createdAt)}</p>
                          </div>
                          <div>
                            <p>Cliente: {order.user.name}</p>
                            <p>Email: {order.user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          {translateOrderStatus(order.status.name)}
                        </Badge>
                      </div>
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
                        <div className="flex gap-2 mt-3">
                          <Link href={`/admin/pedidos/${order.id}`}>
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
