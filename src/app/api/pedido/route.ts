import { SituationEnum } from "@/dd";
import { generateUniqueCode } from "@/lib/order-utils";
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

    const body = await req.json();
    console.log("📦 Dados recebidos na API:", JSON.stringify(body, null, 2));

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
    } = body;

    console.log("🖼️ Imagens recebidas:", images);
    console.log("📊 Quantidade de imagens:", images ? images.length : 0);

    const parsedPrice = parseInt(price);
    const parsedArea = parseFloat(totalArea);
    const parsedYear = parseInt(constructionYear);
    const parsedPropertyType = parseInt(propertyTypeId);

    console.log("🔧 Dados processados:", {
      parsedPrice,
      parsedArea,
      parsedYear,
      parsedPropertyType,
    });

    const property = await PrismaInstance.property.create({
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
        user: {
          connect: {
            id: token.sub,
          },
        },
        tenant: {
          connect: {
            id: token.tenantId!,
          },
        },
      },
    });

    console.log("🏠 Propriedade criada:", property.id);

    const orderCode = await generateUniqueCode(token.sub!, token.tenantId!);

    const order = await PrismaInstance.order.create({
      data: {
        userId: token.sub!,
        tenantId: token.tenantId!,
        propertyId: property.id,
        statusId: SituationEnum.PENDING,
        name: orderName,
        code: orderCode,
      },
    });

    console.log("📋 Pedido criado:", order.id);

    // Salvar imagens se fornecidas
    if (images && images.length > 0) {
      console.log("💾 Iniciando salvamento de imagens...");
      
      for (const imageData of images) {
        console.log("🖼️ Processando imagem:", imageData);
        
        try {
          // Criar registro de imagem
          const image = await PrismaInstance.image.create({
            data: {
              url: imageData.url,
              description: imageData.originalName,
            },
          });

          console.log("📸 Imagem criada:", image.id);

          // Criar relação entre propriedade e imagem
          const propertyImage = await PrismaInstance.propertyImage.create({
            data: {
              propertyId: property.id,
              imageId: image.id,
            },
          });

          console.log("🔗 Relação PropertyImage criada:", propertyImage.id);
        } catch (error) {
          console.error("❌ Erro ao processar imagem:", imageData, error);
        }
      }
      
      console.log("✅ Processamento de imagens concluído");
    } else {
      console.log("ℹ️ Nenhuma imagem fornecida");
    }

    return NextResponse.json(
      {},
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("❌ Erro geral na API:", error);
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
        tenantId: token.tenantId!,
        statusId: {
          not: SituationEnum.CANCELED,
        },
      },
      include: {
        status: {
          select: {
            name: true,
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
      orderBy: {
        createdAt: 'desc',
      },
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
