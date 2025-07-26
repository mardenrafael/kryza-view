import PrismaInstance from "./prisma";

export const generateUniqueCode = async (userId: string, tenantId: string) => {
  let code: number;
  let isUnique = false;

  while (!isUnique) {
    // Gera um código de 6 dígitos
    code = Math.floor(100000 + Math.random() * 900000);

    // Verifica se o código já existe para este usuário e tenant
    const existingOrder = await PrismaInstance.order.findFirst({
      where: {
        userId: userId,
        tenantId: tenantId,
        code: code,
      },
    });

    if (!existingOrder) {
      isUnique = true;
    }
  }

  return code!;
};

export const statusTranslations: Record<string, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CANCELED: "Cancelado",
  IN_PROGRESS: "Em Andamento",
  COMPLETED: "Concluído",
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  DELETED: "Deletado",
  ARCHIVED: "Arquivado",
  SUSPENDED: "Suspenso",
  EXPIRED: "Expirado",
  UNDER_ANALYSIS: "Em Análise",
};

export const translateOrderStatus = (statusName: string): string => {
  return statusTranslations[statusName] || statusName;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};
