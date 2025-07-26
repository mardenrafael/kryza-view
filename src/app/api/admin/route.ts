import PrismaInstance from "@/lib/prisma";
import { getUserData } from "@/lib/utils";
import { NextResponse } from "next/server"; 

export async function GET(req: Request) {
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

    return NextResponse.json({ message: "Acesso permitido" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
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
        { error: "Acesso negado. Apenas o proprietário do tenant pode alterar pedidos." },
        { status: 403 }
      );
    }

    const { orderId, statusId } = await req.json();

    if (!orderId || !statusId) {
      return NextResponse.json(
        { error: "Order ID and Status ID are required" },
        { status: 400 }
      );
    }

    // Verifica se o pedido pertence ao tenant do usuário
    const order = await PrismaInstance.order.findFirst({
      where: {
        id: orderId,
        tenantId: user.tenant.id,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Atualiza a situação do pedido
    const updatedOrder = await PrismaInstance.order.update({
      where: { id: orderId },
      data: { statusId: parseInt(statusId) },
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
          select: {
            description: true,
            addressCity: true,
            addressState: true,
            price: true,
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

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
} 