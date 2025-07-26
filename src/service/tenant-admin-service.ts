import { CONSTANTS } from "@/constants";
import PrismaInstance from "@/lib/prisma";

export interface TenantBrandingData {
  tenantId: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  companyName: string;
  companySlogan?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  socialMedia?: any;
}

export interface TenantData {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  createdAt: string;
  updatedAt: string;
  firstAccess: number;
  status: {
    id: number;
    name: string;
  };
  userOwner: {
    id: string;
    name: string;
    email: string;
  };
  branding?: TenantBrandingData;
  _count: {
    users: number;
    order: number;
    property: number;
  };
}

async function getTenantBranding(tenantId: string): Promise<TenantBrandingData | null> {
  const branding = await PrismaInstance.tenantBranding.findUnique({
    where: { tenantId },
  });

  return branding;
}

async function saveTenantBranding(data: TenantBrandingData): Promise<TenantBrandingData> {
  const branding = await PrismaInstance.tenantBranding.upsert({
    where: { tenantId: data.tenantId },
    update: {
      primaryColor: data.primaryColor || "#d7263d",
      secondaryColor: data.secondaryColor || "#f9fafb",
      accentColor: data.accentColor || "#1f2937",
      logoUrl: data.logoUrl,
      faviconUrl: data.faviconUrl,
      companyName: data.companyName,
      companySlogan: data.companySlogan,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address,
      socialMedia: data.socialMedia,
    },
    create: {
      tenantId: data.tenantId,
      primaryColor: data.primaryColor || "#d7263d",
      secondaryColor: data.secondaryColor || "#f9fafb",
      accentColor: data.accentColor || "#1f2937",
      logoUrl: data.logoUrl,
      faviconUrl: data.faviconUrl,
      companyName: data.companyName,
      companySlogan: data.companySlogan,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address,
      socialMedia: data.socialMedia,
    },
  });

  return branding;
}

async function markFirstAccessComplete(tenantId: string): Promise<void> {
  await PrismaInstance.tenant.update({
    where: { id: tenantId },
    data: {
      firstAccess: CONSTANTS.NAO,
    },
  });
}

export { getTenantBranding, saveTenantBranding, markFirstAccessComplete }; 