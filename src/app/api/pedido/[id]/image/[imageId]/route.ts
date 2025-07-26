import { SituationEnum } from "@/dd";
import PrismaInstance from "@/lib/prisma";
import { getUserData } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await params;
  
  try {
    const token = await getUserData(req);
    if (!token.sub) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 403 }
      );
    }

    // Verifica se o pedido existe, pertence ao usuário e está pendente
    const order = await PrismaInstance.order.findFirst({
      where: {
        id: id,
        userId: token.sub,
        statusId: SituationEnum.PENDING, // Apenas pedidos pendentes podem ter imagens removidas
      },
      include: {
        property: {
          include: {
            propertyImage: {
              where: {
                imageId: imageId,
              },
              include: {
                image: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or cannot be modified" },
        { status: 404 }
      );
    }

    if (order.property.propertyImage.length === 0) {
      return NextResponse.json(
        { error: "Image not found in this order" },
        { status: 404 }
      );
    }

    const propertyImage = order.property.propertyImage[0];

    // Remove a relação PropertyImage
    await PrismaInstance.propertyImage.delete({
      where: { id: propertyImage.id },
    });

    // Remove a imagem
    await PrismaInstance.image.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ message: "Image removed successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove image" },
      { status: 500 }
    );
  }
} 