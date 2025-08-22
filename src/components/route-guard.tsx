"use client";

import { useTenantOwner } from "@/hooks/use-tenant-owner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedForOwner?: boolean;
  allowedForUsers?: boolean;
}

export function RouteGuard({
  children,
  allowedForOwner = false,
  allowedForUsers = true,
}: RouteGuardProps) {
  const { isOwner, loading } = useTenantOwner();
  const router = useRouter();

  useEffect(() => {
    console.table({
      isOwner,
      loading,
      allowedForOwner,
      allowedForUsers,
    });

    if (!loading) {
      if (allowedForOwner && !isOwner) {
        router.push("/app");
        return;
      }

      if (allowedForUsers && isOwner) {
        router.push("/admin/dashboard");
        return;
      }
    }
  }, [isOwner, loading, allowedForOwner, allowedForUsers, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (allowedForOwner && !isOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Esta área é restrita apenas para administradores do sistema.
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/app">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ir para Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (allowedForUsers && isOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Área de Usuários</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Como administrador do sistema, você deve usar a área
              administrativa para gerenciar pedidos.
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/admin/dashboard">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ir para Administração
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
