import { hash } from "@/lib/crypto";
import PrismaInstance, { handlePrismaError } from "@/lib/prisma";
import { getSubdomain } from "@/lib/utils";
import { getTenantIdBySubDomain } from "@/service/tenant-service";

export async function POST(request: Request) {
  const { name, email, password, confirmPassword } = await request.json();

  if (!name || !email || !password || !confirmPassword) {
    return Response.json(
      {
        message: "Preencha todos os campos",
      },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return Response.json(
      {
        message: "As senhas não coincidem",
      },
      { status: 400 }
    );
  }

  const host = request.headers.get("host");
  const subDomain = getSubdomain(host);

  if (!subDomain) {
    return Response.json(
      {
        message:
          "Ocorreu um erro ao obter o subdomínio, se o erro persistir, entre em contato com o suporte.",
      },
      { status: 500 }
    );
  }

  const tenantId = await getTenantIdBySubDomain(subDomain);

  const hashedPassword = await hash(password);

  try {
    await PrismaInstance.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        tenantId,
      },
    });
    return Response.json(
      {
        message: "User created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const { message, status } = handlePrismaError(error);
    return Response.json(
      {
        message,
      },
      {
        status,
      }
    );
  }
}
