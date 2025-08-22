import { SituationEnum } from "@/dd";
import { getLoggerContext } from "@/lib/logger";
import { generateUniqueCode } from "@/lib/order-utils";
import PrismaInstance from "@/lib/prisma";
import { getUserData } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const log = getLoggerContext(request);

  try {
    const token = await getUserData(request);

    if (!token.sub) {
      log.warn("User ID is required but not found in token");

      return NextResponse.json(
        { error: "User ID is required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    log.debug(body, "Body received in POST /api/pedido");

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

    log.debug(images, "Received images in POST /api/pedido");

    const parsedPrice = parseInt(price);
    const parsedArea = parseFloat(totalArea);
    const parsedYear = parseInt(constructionYear);
    const parsedPropertyType = parseInt(propertyTypeId);

    log.debug(
      {
        parsedPrice,
        parsedArea,
        parsedYear,
        parsedPropertyType,
      },
      "Parsed values from request body"
    );

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

    log.debug(property, "Property created");

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

    log.debug(order, "Order created");

    if (images && images.length > 0) {
      log.debug("Processing images:", images);

      for (const imageData of images) {
        log.debug("Processing image:", imageData);

        try {
          const image = await PrismaInstance.image.create({
            data: {
              url: imageData.url,
              description: imageData.originalName,
            },
          });

          log.debug(image, "Image created");
          const propertyImage = await PrismaInstance.propertyImage.create({
            data: {
              propertyId: property.id,
              imageId: image.id,
            },
          });

          log.debug(propertyImage, "PropertyImage relation created");
        } catch (error) {
          log.error(imageData, "Error processing image");
        }
      }

      log.debug("Image processing completed");
    } else {
      log.debug("No images provided");
    }

    return NextResponse.json(
      {},
      {
        status: 201,
      }
    );
  } catch (error) {
    log.error(error, "General error in API");
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
        createdAt: "desc",
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
