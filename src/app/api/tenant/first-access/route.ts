import { NextRequest, NextResponse } from "next/server";
import { markFirstAccessComplete } from "@/service/tenant-admin-service";
import { getIsfirstAcessByTenantId } from "@/service/tenant-service";
import { handlePrismaError } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId } = body;

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID é obrigatório" },
        { status: 400 }
      );
    }

    await markFirstAccessComplete(tenantId);

    return NextResponse.json({ success: true });
  } catch (error) {
    const prismaError = handlePrismaError(error);
    return NextResponse.json(
      { error: prismaError.message },
      { status: prismaError.status }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID é obrigatório" },
        { status: 400 }
      );
    }

    const firstAccess = await getIsfirstAcessByTenantId(tenantId);
    return NextResponse.json({ firstAccess });
  } catch (error) {
    const prismaError = handlePrismaError(error);
    return NextResponse.json(
      { error: prismaError.message },
      { status: prismaError.status }
    );
  }
} 