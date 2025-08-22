"use client";

import { useTenantOwner } from "@/hooks/use-tenant-owner";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function PrivateLayout({ children }: PropsWithChildren) {
  const { isOwner, loading } = useTenantOwner();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (isOwner && pathname === "/admin") {
        router.push("/admin/dashboard");
      } else if (!isOwner && pathname === "/app") {
        router.push("/app");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return children;
}
