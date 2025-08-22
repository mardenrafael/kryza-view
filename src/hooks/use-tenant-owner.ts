"use client";

import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useTenantOwner() {
  const { data: session } = useSession();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOwnerStatus = async () => {
      if (!session?.tenantId) {
        setIsOwner(false);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/admin");
        setIsOwner(true);
      } catch (error) {
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwnerStatus();
  }, []);

  return { isOwner, loading };
}
