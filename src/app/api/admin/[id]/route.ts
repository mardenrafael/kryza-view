import PrismaInstance from "@/lib/prisma";
import { getUserData } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const token = await getUserData(req);

    if (!token.sub) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 403 }
      );
    }

    // Verifica se o usuário é o proprietário do tenant
    const user = await PrismaInstance.user.findUnique({
      where: { id: token.sub },
      include: {
        tenant: {
          select: {
            id: true,
            userOwnerId: true,
          },
        },
      },
    });

    if (!user || !user.tenant || user.tenant.userOwnerId !== token.sub) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas o proprietário do tenant pode acessar." },
        { status: 403 }
      );
    }

    const order = await PrismaInstance.order.findFirst({
      where: {
        id: id,
        tenantId: user.tenant.id,
      },
      include: {
        status: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          include: {
            propertyType: {
              select: {
                id: true,
                name: true,
              },
            },
            propertyImage: {
              include: {
                image: {
                  select: {
                    id: true,
                    url: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar detalhes do pedido" },
      { status: 500 }
    );
  }
} 