import { PropertyTypeEnum } from "@/dd";
import PrismaInstance from "@/lib/prisma";
import { getUserData } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getUserData(req);
    if (!token.sub) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 403 }
      );
    }

    const order = await PrismaInstance.order.findUnique({
      where: {
        id: params.id,
        userId: token.sub,
        statusId: {
          not: PropertyTypeEnum.CANCELED,
        },
      },
      include: { photos: true, status: true },
    });
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { statusId } = await req.json();
  try {
    const token = await getUserData(req);
    if (!token.sub) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 403 }
      );
    }

    const order = await PrismaInstance.order.update({
      where: { id: params.id, userId: token.sub },
      data: { statusId },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getUserData(req);
    if (!token.sub) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 403 }
      );
    }

    await PrismaInstance.order.update({
      where: { id: params.id, userId: token.sub },
      data: { statusId: PropertyTypeEnum.CANCELED },
    });
    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
