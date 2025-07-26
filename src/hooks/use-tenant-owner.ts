import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useTenantOwner() {
  const { data: session } = useSession();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOwnerStatus = async () => {
      console.log("session", session);
      console.log("session.tenantId", !session?.tenantId);
      if (!session?.tenantId) {
        setIsOwner(false);
        setLoading(false);
        return;
      }

      try {
        // Tenta acessar a API de admin para verificar se é proprietário
        const response = await api.get("/api/admin");
        console.log("response", response.data);
        setIsOwner(true);
        console.log("isOwner 2", isOwner);
      } catch (error) {
        console.log("error", error);
        // Se der erro 403, não é proprietário
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwnerStatus();
  }, []);

  return { isOwner, loading };
} 