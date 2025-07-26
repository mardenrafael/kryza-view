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
  
      const orders = await PrismaInstance.order.findMany({
        where: {
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
  