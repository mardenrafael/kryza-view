import PrismaInstance from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subdomain = searchParams.get("subdomain");

    if (!subdomain) {
      return NextResponse.json(
        { error: "Subdomínio inválido" },
        { status: 400 }
      );
    }
    const tenant = await PrismaInstance.tenant.findUnique({
      where: { slug: subdomain },
      select: {
        id: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ tenant });
  } catch (error) {
    console.error("Erro na API de Tenant:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
