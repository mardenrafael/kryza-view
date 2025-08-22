import { getLoggerContext } from "@/lib/logger";
import PrismaInstance from "@/lib/prisma";
import { getUserData } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const log = getLoggerContext(req);

  try {
    const token = await getUserData(req);

    if (!token.sub) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 403 }
      );
    }

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
        {
          error: "Acesso negado. Apenas o proprietário do tenant pode acessar.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ message: "Acesso permitido" }, { status: 200 });
  } catch (error) {
    log.error(error, "Error on get user permission");
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const log = getLoggerContext(req);
  try {
    const token = await getUserData(req);

    if (!token.sub) {
      log.warn("");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 403 }
      );
    }

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
        {
          error:
            "Acesso negado. Apenas o proprietário do tenant pode alterar pedidos.",
        },
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

    const order = await PrismaInstance.order.findFirst({
      where: {
        id: orderId,
        tenantId: user.tenant.id,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

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
