"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import {
  BaggageClaimIcon,
  ClockIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalUsers: number;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const nome = session?.user?.name || "Administrador";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/admin/pedidos");
        const orders = response.data;

        const stats: DashboardStats = {
          totalOrders: orders.length,
          pendingOrders: orders.filter(
            (order: { status: { name: string } }) =>
              order.status.name === "PENDING"
          ).length,
          completedOrders: orders.filter(
            (order: { status: { name: string } }) =>
              order.status.name === "COMPLETED"
          ).length,
          totalUsers: new Set(
            orders.map((order: { user: { id: string } }) => order.user.id)
          ).size,
        };

        setStats(stats);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
            Bem-vindo ao painel administrativo. Aqui você pode gerenciar todos
            os pedidos e acompanhar as estatísticas do sistema.
          </CardDescription>
        </CardHeader>
      </Card>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                Todos os pedidos do sistema
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuários Ativos
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Usuários com pedidos
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades administrativas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/pedidos"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-3">
                <BaggageClaimIcon className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Gerenciar Pedidos</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualizar e alterar status dos pedidos
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
