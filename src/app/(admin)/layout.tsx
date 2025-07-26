"use client";

import { Header } from "@/components/header";
import { PropsWithChildren, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { getIsfirstAcessByTenantId } from "@/service/tenant-service";

export default function AdminLayout({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkFirstAccess = async () => {
      if (status === "loading") return;
      
      if (status === "unauthenticated") {
        router.push("/login");
        return;
      }

      if (session?.tenantId && pathname !== "/admin/config") {
        try {
          const isFirstAccess = await getIsfirstAcessByTenantId(session.tenantId as string);
          if (isFirstAccess) {
            router.push("/admin/config");
            return;
          }
        } catch (error) {
          console.error("Erro ao verificar primeiro acesso:", error);
        }
      }
      
      setChecking(false);
    };

    checkFirstAccess();
  }, [session, status, pathname, router]);

  if (status === "loading" || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background flex">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  );
}
