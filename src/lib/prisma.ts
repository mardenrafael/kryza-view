import { PrismaClient } from "@/app/generated/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

declare global {
  var prisma: PrismaClient | undefined;
}

const PrismaInstance = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = PrismaInstance;
}

export default PrismaInstance;

interface PrismaError {
  code: string;
  message: string;
  status: number;
}

const prismaErrorMap: Record<string, { message: string; status: number }> = {
  P2002: {
    message: "Um registro com este valor já existe.",
    status: 409,
  },
  P2025: {
    message: "Registro não encontrado.",
    status: 404,
  },
  P2003: {
    message: "Restrição de chave estrangeira violada.",
    status: 422,
  },
  P2000: {
    message: "O valor é muito longo para este campo.",
    status: 400,
  },
  P2016: {
    message: "Registro não encontrado. Verifique os relacionamentos.",
    status: 404,
  },
};

export function handlePrismaError(error: unknown): PrismaError {
  if (typeof error === "object" && error !== null && "code" in error) {
    const prismaError = error as PrismaClientKnownRequestError;
    const errorData = prismaErrorMap[prismaError.code];

    if (errorData) {
      console.error(
        `Prisma Error [${prismaError.code}]: ${prismaError.message}`
      );
      return {
        code: prismaError.code,
        message: errorData.message,
        status: errorData.status,
      };
    }
  }

  console.error("Erro não identificado:", error);

  return {
    code: "UNKNOWN_ERROR",
    message: "Ocorreu um erro inesperado.",
    status: 500,
  };
}
