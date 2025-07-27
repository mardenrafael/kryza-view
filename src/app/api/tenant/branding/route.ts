import { handlePrismaError } from "@/lib/prisma";
import {
  getTenantBranding,
  saveTenantBranding,
} from "@/service/tenant-admin-service";
import { NextRequest, NextResponse } from "next/server";

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

    const branding = await getTenantBranding(tenantId);

    if (!branding) {
      return NextResponse.json(
        { error: "Configuração de branding não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(branding);
  } catch (error) {
    const prismaError = handlePrismaError(error);
    return NextResponse.json(
      { error: prismaError.message },
      { status: prismaError.status }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      primaryColor,
      secondaryColor,
      accentColor,
      logoUrl,
      faviconUrl,
      companyName,
      companySlogan,
      contactEmail,
      contactPhone,
      address,
      socialMedia,
    } = body;

    if (!tenantId || !companyName) {
      return NextResponse.json(
        { error: "Tenant ID e nome da empresa são obrigatórios" },
        { status: 400 }
      );
    }

    const branding = await saveTenantBranding({
      tenantId,
      primaryColor,
      secondaryColor,
      accentColor,
      logoUrl,
      faviconUrl,
      companyName,
      companySlogan,
      contactEmail,
      contactPhone,
      address,
      socialMedia,
    });

    return NextResponse.json(branding, { status: 201 });
  } catch (error) {
    const prismaError = handlePrismaError(error);
    return NextResponse.json(
      { error: prismaError.message },
      { status: prismaError.status }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      primaryColor,
      secondaryColor,
      accentColor,
      logoUrl,
      faviconUrl,
      companyName,
      companySlogan,
      contactEmail,
      contactPhone,
      address,
      socialMedia,
    } = body;

    if (!tenantId || !companyName) {
      return NextResponse.json(
        { error: "Tenant ID e nome da empresa são obrigatórios" },
        { status: 400 }
      );
    }

    const branding = await saveTenantBranding({
      tenantId,
      primaryColor,
      secondaryColor,
      accentColor,
      logoUrl,
      faviconUrl,
      companyName,
      companySlogan,
      contactEmail,
      contactPhone,
      address,
      socialMedia,
    });

    return NextResponse.json(branding);
  } catch (error) {
    const prismaError = handlePrismaError(error);
    return NextResponse.json(
      { error: prismaError.message },
      { status: prismaError.status }
    );
  }
}
