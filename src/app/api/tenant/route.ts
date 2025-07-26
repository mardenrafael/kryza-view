import { getSubdomain } from "@/lib/utils";
import {
  getIsfirstAcessByTenantId,
  getTenantIdBySubDomain,
} from "@/service/tenant-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let subdomain = searchParams.get("subdomain");
    if (!subdomain) {
      const hostname = req.headers.get("host");
      subdomain = getSubdomain(hostname);
    }

    if (!subdomain) {
      return NextResponse.json(
        { error: "Subdomínio inválido" },
        { status: 400 }
      );
    }

    const tenantId = await getTenantIdBySubDomain(subdomain);

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant não encontrado" },
        { status: 404 }
      );
    }

    const isFirstAcess = await getIsfirstAcessByTenantId(tenantId);

    return NextResponse.json({ id: tenantId, isFirstAcess });
  } catch (error) {
    console.error("Erro na API de Tenant:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
