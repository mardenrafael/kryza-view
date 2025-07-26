"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageGallery } from "@/components/ui/image-gallery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SituationEnum } from "@/dd";
import { api } from "@/lib/api";
import {
  formatCurrency,
  formatDate,
  statusTranslations,
  translateOrderStatus,
} from "@/lib/order-utils";
import {
  ArrowLeft,
  Building,
  Calendar,
  DollarSign,
  Home,
  MapPin,
  Ruler,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface OrderDetail {
  id: string;
  code: number;
  name: string;
  createdAt: string;
  updatedAt: string;
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
    addressStreet: string;
    addressNumber: string;
    addressComplement?: string;
    addressCity: string;
    addressState: string;
    addressZipCode: string;
    addressNeighborhood: string;
    totalArea: number;
    constructionYear?: number;
    price: number;
    propertyType: {
      id: number;
      name: string;
    };
    propertyImage: {
      image: {
        id: string;
        url: string;
        description: string;
      };
    }[];
  };
}

export default function AdminPedidoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails(params.id as string);
    }
  }, [params.id]);

  const fetchOrderDetails = async (orderId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/admin/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      router.push("/admin/pedidos");
    }
    setLoading(false);
  };

  const updateOrderStatus = async (statusId: string) => {
    if (!order) return;

    setUpdatingStatus(true);
    try {
      const response = await api.patch("/api/admin", {
        orderId: order.id,
        statusId,
      });

      setOrder((prev) =>
        prev ? { ...prev, status: response.data.status } : null
      );
      toast.success("Situação do pedido atualizada com sucesso!");
    } catch (error) {}
    setUpdatingStatus(false);
  };

  // const getStatusOptions = () => [
  //   { value: "1", label: "Pendente" },
  //   { value: "2", label: "Aprovado" },
  //   { value: "3", label: "Rejeitado" },
  //   { value: "4", label: "Cancelado" },
  //   { value: "5", label: "Em Andamento" },
  //   { value: "6", label: "Concluído" },
  // ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Carregando detalhes do pedido...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Pedido não encontrado.</p>
          <Link href="/admin/pedidos">
            <Button className="mt-4">Voltar para Pedidos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pedidos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {order.name || `Pedido #${order.code}`}
            </h1>
            <p className="text-muted-foreground">
              Código: {order.code} • Criado em {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {translateOrderStatus(order.status.name)}
          </Badge>
          {order.status.name !== "CANCELED" && (
            <Select
              value={order.status.id.toString()}
              onValueChange={updateOrderStatus}
              disabled={updatingStatus}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Alterar situação" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SituationEnum).map(([label, value]) => {
                  return (
                    <SelectItem key={value} value={"" + value}>
                      {translateOrderStatus(label)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Nome</p>
              <p className="text-sm text-muted-foreground">{order.user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                {order.user.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">ID do Cliente</p>
              <p className="text-sm text-muted-foreground">{order.user.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Pedido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Código</p>
              <p className="text-sm text-muted-foreground">{order.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Criado em</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Última atualização</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(order.updatedAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Situação</p>
              <Badge variant="outline" className="text-xs">
                {translateOrderStatus(order.status.name)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Imóvel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Imóvel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Tipo</p>
              <p className="text-sm text-muted-foreground">
                {order.property.propertyType.name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Área</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Ruler className="h-3 w-3" />
                {order.property.totalArea} m²
              </p>
            </div>
            {order.property.constructionYear && (
              <div>
                <p className="text-sm font-medium">Ano de Construção</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {order.property.constructionYear}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Valor</p>
              <p className="text-sm font-semibold text-green-600 flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {formatCurrency(order.property.price)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Descrição do Imóvel */}
      <Card>
        <CardHeader>
          <CardTitle>Descrição do Imóvel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{order.property.description}</p>
        </CardContent>
      </Card>

      {/* Endereço Completo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço Completo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Rua</p>
              <p className="text-sm text-muted-foreground">
                {order.property.addressStreet}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Número</p>
              <p className="text-sm text-muted-foreground">
                {order.property.addressNumber}
              </p>
            </div>
            {order.property.addressComplement && (
              <div>
                <p className="text-sm font-medium">Complemento</p>
                <p className="text-sm text-muted-foreground">
                  {order.property.addressComplement}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Bairro</p>
              <p className="text-sm text-muted-foreground">
                {order.property.addressNeighborhood}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Cidade</p>
              <p className="text-sm text-muted-foreground">
                {order.property.addressCity}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Estado</p>
              <p className="text-sm text-muted-foreground">
                {order.property.addressState}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">CEP</p>
              <p className="text-sm text-muted-foreground">
                {order.property.addressZipCode}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Imagens do Imóvel */}
      {order.property.propertyImage.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Imagens do Imóvel</CardTitle>
            <p className="text-sm text-muted-foreground">
              {order.property.propertyImage.length} imagem(ns) anexada(s)
            </p>
          </CardHeader>
          <CardContent>
            <ImageGallery
              images={order.property.propertyImage.map((img) => img.image)}
              trigger={
                <Button variant="outline" size="lg">
                  Visualizar {order.property.propertyImage.length} Imagem(ns)
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      <div className="flex justify-end gap-3">
        <Link href="/admin/pedidos">
          <Button variant="outline">Voltar para Lista</Button>
        </Link>
      </div>
    </div>
  );
}
