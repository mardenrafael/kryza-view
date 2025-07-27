"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageGallery } from "@/components/ui/image-gallery";
import { ImageGalleryWithRemove } from "@/components/ui/image-gallery-with-remove";
import { api } from "@/lib/api";
import {
  formatCurrency,
  formatDate,
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

export default function PedidoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails(params.id as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchOrderDetails = async (orderId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/pedido/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do pedido:", error);
      toast.error("Erro ao carregar detalhes do pedido");
      router.push("/app/pedido");
    }
    setLoading(false);
  };

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
          <Link href="/app/pedido">
            <Button className="mt-4">Voltar para Meus Pedidos</Button>
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
          <Link href="/app/pedido">
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
        <Badge variant="outline" className="text-sm">
          {translateOrderStatus(order.status.name)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações do Pedido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informações do Pedido
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
              Informações do Imóvel
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
              {order.status.name === "PENDING" &&
                " • Clique nas imagens para visualizar ou remover"}
            </p>
          </CardHeader>
          <CardContent>
            {order.status.name === "PENDING" ? (
              <ImageGalleryWithRemove
                images={order.property.propertyImage.map((img) => img.image)}
                orderId={order.id}
                canRemove={true}
                onImageRemoved={(imageId) => {
                  // Atualiza o estado local removendo a imagem
                  setOrder((prev) =>
                    prev
                      ? {
                          ...prev,
                          property: {
                            ...prev.property,
                            propertyImage: prev.property.propertyImage.filter(
                              (pi) => pi.image.id !== imageId
                            ),
                          },
                        }
                      : null
                  );
                }}
                trigger={
                  <Button variant="outline" size="lg">
                    Visualizar {order.property.propertyImage.length} Imagem(ns)
                  </Button>
                }
              />
            ) : (
              <ImageGallery
                images={order.property.propertyImage.map((img) => img.image)}
                trigger={
                  <Button variant="outline" size="lg">
                    Visualizar {order.property.propertyImage.length} Imagem(ns)
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      <div className="flex justify-end gap-3">
        {order.status.name === "PENDING" && (
          <Link href={`/app/pedido/${order.id}/editar`}>
            <Button>Editar Pedido</Button>
          </Link>
        )}
        <Link href="/app/pedido">
          <Button variant="outline">Voltar para Meus Pedidos</Button>
        </Link>
      </div>
    </div>
  );
}
