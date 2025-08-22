"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { translateOrderStatus } from "@/lib/order-utils";
import {
  BaggageClaimIcon,
  ClockIcon,
  PlusIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserDashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  recentOrders: {
    id: string;
    name: string;
    code: string;
    property: { addressCity: string; addressState: string };
    status: { name: string };
  }[];
}

export default function UserDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const nome = session?.user?.name || "Usuário";

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await api.get("/api/pedido");
        const orders = response.data;

        const stats: UserDashboardStats = {
          totalOrders: orders.length,
          pendingOrders: orders.filter(
            (order: { status: { name: string } }) =>
              order.status.name === "PENDING"
          ).length,
          completedOrders: orders.filter(
            (order: { status: { name: string } }) =>
              order.status.name === "COMPLETED"
          ).length,
          recentOrders: orders.slice(0, 5),
        };

        setStats(stats);
      } catch (error) {
        toast.error("Erro ao carregar estatísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Olá, {nome}!</CardTitle>
          <CardDescription>
            Bem-vindo ao seu painel. Aqui você pode acompanhar seus pedidos,
            criar novos pedidos e acompanhar o status das suas análises.
          </CardDescription>
        </CardHeader>
      </Card>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Pedidos
              </CardTitle>
              <BaggageClaimIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Todos os seus pedidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pedidos Pendentes
              </CardTitle>
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingOrders}
              </div>
              <p className="text-xs text-muted-foreground">
                Aguardando análise
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pedidos Concluídos
              </CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.completedOrders}
              </div>
              <p className="text-xs text-muted-foreground">
                Análises finalizadas
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/app/pedido/novo"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-3">
                <PlusIcon className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Novo Pedido</h3>
                  <p className="text-sm text-muted-foreground">
                    Criar nova análise de imóvel
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/app/pedido"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-3">
                <BaggageClaimIcon className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Meus Pedidos</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualizar todos os pedidos
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {stats && stats.recentOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>Seus últimos pedidos criados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map(
                (order: {
                  id: string;
                  name: string;
                  code: string;
                  property: { addressCity: string; addressState: string };
                  status: { name: string };
                }) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {order.name || `Pedido #${order.code}`}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {order.property.addressCity},{" "}
                        {order.property.addressState}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          order.status.name === "PENDING"
                            ? "secondary"
                            : order.status.name === "COMPLETED"
                            ? "default"
                            : "outline"
                        }
                      >
                        {translateOrderStatus(order.status.name)}
                      </Badge>
                      <Link href={`/app/pedido/${order.id}`}>
                        <span className="text-sm text-primary hover:underline">
                          Ver detalhes
                        </span>
                      </Link>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
