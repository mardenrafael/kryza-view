"use client";

import { api } from "@/lib/api";
import { ErrorType } from "@/lib/error-types";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

export type BrandingType = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  companyName: string;
};

type TenantProviderProps = PropsWithChildren & {};

type TenantContextType = {
  tenantId: string;
  branding: BrandingType | null;
  setBranding: (branding: BrandingType | null) => void;
};
export const TenantContext = createContext<TenantContextType>({
  tenantId: "",
  branding: null,
  setBranding: () => {},
});

export function useTenant() {
  return useContext(TenantContext);
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenantId, setTenantId] = useState<string>("");
  const [branding, setBranding] = useState<BrandingType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function fetchTenantData() {
      try {
        setIsLoading(true);
        const response = await api.get("/api/tenant");
        if (response.status !== 200) {
          throw new Error("Failed to fetch tenant ID");
        }
        const tenantId = response.data.tenantId;
        if (tenantId) {
          setTenantId(tenantId);
          // Buscar branding
          try {
            const brandingResp = await api.get(
              `/api/tenant/branding?tenantId=${tenantId}`
            );
            setBranding(brandingResp.data);
            if (brandingResp.data) {
              document.documentElement.style.setProperty(
                "--primary",
                brandingResp.data.primaryColor || "#d7263d"
              );
              document.documentElement.style.setProperty(
                "--secondary",
                brandingResp.data.secondaryColor || "#f9fafb"
              );
              document.documentElement.style.setProperty(
                "--accent",
                brandingResp.data.accentColor || "#1f2937"
              );
            }
          } catch (e) {
            setBranding(null);
          }
        }
        if (response.data.isFirstAcess) {
          const firstAccessUrl = new URL(
            "/admin/config",
            window.location.origin
          );
          router.push(firstAccessUrl.toString());
        }
      } catch (error) {
        const errorUrl = new URL("/error", window.location.origin);
        errorUrl.searchParams.set("error", ErrorType.SUBDOMAIN_NOT_FOUND);
        router.push(errorUrl.toString());
      } finally {
        setIsLoading(false);
      }
    }
    if (pathname !== "/error") {
      fetchTenantData();
    }
  }, [pathname]);

  useEffect(() => {
    if (branding) {
      document.documentElement.style.setProperty(
        "--primary",
        branding.primaryColor || "#d7263d"
      );
      document.documentElement.style.setProperty(
        "--secondary",
        branding.secondaryColor || "#f9fafb"
      );
      document.documentElement.style.setProperty(
        "--accent",
        branding.accentColor || "#1f2937"
      );
    }
  }, [branding]);

  if (isLoading) {
    return (
      <motion.div
        key="theme-change-spinner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />
      </motion.div>
    );
  }

  return (
    <TenantContext.Provider value={{ tenantId, branding, setBranding }}>
      {children}
    </TenantContext.Provider>
  );
}
