import { SituationEnum } from "@/dd";
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

    const order = await PrismaInstance.order.findUnique({
      where: {
        id: id,
        userId: token.sub,
        statusId: {
          not: SituationEnum.CANCELED,
        },
      },
      include: {
        status: {
          select: {
            id: true,
            name: true,
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
                image: true,
              },
            },
          },
        },
      },
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

export async function PUT(
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

    // Verifica se o pedido existe e pertence ao usuário
    const existingOrder = await PrismaInstance.order.findFirst({
      where: {
        id: id,
        userId: token.sub,
        statusId: SituationEnum.PENDING, // Apenas pedidos pendentes podem ser editados
      },
      include: {
        property: {
          include: {
            propertyImage: {
              include: {
                image: true,
              },
            },
          },
        },
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found or cannot be edited" },
        { status: 404 }
      );
    }

    const {
      addressCity,
      addressNumber,
      addressState,
      addressStreet,
      addressZipCode,
      addressNeighborhood,
      orderName,
      description,
      price,
      totalArea,
      addressComplement,
      constructionYear,
      propertyTypeId,
      images,
    } = await req.json();

    const parsedPrice = parseInt(price);
    const parsedArea = parseFloat(totalArea);
    const parsedYear = parseInt(constructionYear);
    const parsedPropertyType = parseInt(propertyTypeId);

    await PrismaInstance.order.update({
      where: { id: id },
      data: {
        name: orderName,
      },
    });

    await PrismaInstance.property.update({
      where: { id: existingOrder.property.id },
      data: {
        addressCity,
        addressNumber,
        addressState,
        addressStreet,
        addressZipCode,
        addressNeighborhood,
        description,
        price: parsedPrice,
        totalArea: parsedArea,
        addressComplement,
        constructionYear: parsedYear,
        propertyType: {
          connect: {
            id: parsedPropertyType,
          },
        },
      },
    });

    // Remove imagens antigas se novas imagens foram fornecidas
    if (images && images.length > 0) {
      // Remove todas as imagens antigas
      for (const propertyImage of existingOrder.property.propertyImage) {
        await PrismaInstance.propertyImage.delete({
          where: { id: propertyImage.id },
        });
        await PrismaInstance.image.delete({
          where: { id: propertyImage.image.id },
        });
      }

      // Adiciona as novas imagens
      for (const imageData of images) {
        const image = await PrismaInstance.image.create({
          data: {
            url: imageData.url,
            description: imageData.originalName,
          },
        });

        await PrismaInstance.propertyImage.create({
          data: {
            propertyId: existingOrder.property.id,
            imageId: image.id,
          },
        });
      }
    }

    // Busca o pedido atualizado para retornar
    const finalOrder = await PrismaInstance.order.findUnique({
      where: { id: id },
      include: {
        status: {
          select: {
            id: true,
            name: true,
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
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(finalOrder);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
      where: { id: id, userId: token.sub },
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

    const order = await PrismaInstance.order.findUnique({
      where: { id: id, userId: token.sub },
      include: { status: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status.id !== SituationEnum.PENDING) {
      return NextResponse.json(
        { error: "Cannot cancel order" },
        { status: 401 }
      );
    }

    await PrismaInstance.order.update({
      where: { id: id, userId: token.sub },
      data: { statusId: SituationEnum.CANCELED },
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
