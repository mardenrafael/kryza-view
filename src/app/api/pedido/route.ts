import { PropertyTypeEnum } from "@/dd";
import PrismaInstance from "@/lib/prisma";
import { getUserData } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const token = await getUserData(req);

    if (!token.sub) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 403 }
      );
    }

    const order = await PrismaInstance.order.create({
      data: {
        userId: token.sub,
        tenantId: token.tenantId,
        statusId: PropertyTypeEnum.PENDING,
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const token = await getUserData(req);

    if (!token.sub) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 403 }
      );
    }

    const orders = await PrismaInstance.order.findMany({
      where: {
        userId: token.sub,
        tenantId: token.tenantId,
        statusId: {
          not: PropertyTypeEnum.CANCELED,
        },
      },
      include: { photos: true, status: true },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
