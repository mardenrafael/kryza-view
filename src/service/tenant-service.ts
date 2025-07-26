import { CONSTANTS } from "@/constants";
import PrismaInstance from "@/lib/prisma";

async function getTenantIdBySubDomain(subDomain: string): Promise<string> {
  const tenant = await PrismaInstance.tenant.findUnique({
    where: {
      slug: subDomain,
    },
    select: {
      id: true,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return tenant.id;
}

async function getIsfirstAcessByTenantId(tenantId: string): Promise<boolean> {
  const tenant = await PrismaInstance.tenant.findUnique({
    where: {
      id: tenantId,
    },
    select: {
      firstAccess: true,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return tenant.firstAccess === CONSTANTS.SIM;
}

export { getTenantIdBySubDomain, getIsfirstAcessByTenantId };
