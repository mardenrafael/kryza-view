import PrismaInstance from "@/lib/prisma";

async function getTenantIdBySubDomain(subDomain: string): Promise<string> {
  const tenant = await PrismaInstance.tenant.findUnique({
    where: {
      slug: subDomain,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return tenant.id;
}

export { getTenantIdBySubDomain };
