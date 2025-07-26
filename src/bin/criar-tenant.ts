import inquirer from "inquirer";
import { PrismaClient } from "../app/generated/prisma";
import { SituationEnum } from "../dd";
import { CONSTANTS } from "../constants";
import { hash } from "../lib/crypto";

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  const { name, email, password, slug, domain } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Digite o nome do usuário proprietário",
    },
    {
      type: "input",
      name: "email",
      message: "Digite o email do usuário proprietário",
    },
    {
      type: "input",
      name: "password",
      message: "Digite a senha do usuário proprietário",
    },
    {
      type: "input",
      name: "slug",
      message: "Digite o slug do usuário proprietário",
    },
    {
      type: "input",
      name: "domain",
      message: "Digite o domínio do usuário",
    },
  ]);

  console.log("Conectando ao banco de dados...");
  await prisma.$connect();
  console.log("Conexão com o banco de dados estabelecida.");

  try {
    console.log("Criando tenant...");

    const userOwner = await prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password),
      },
    });

    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug,
        domain,
        statusId: SituationEnum.ACTIVE,
        firstAccess: CONSTANTS.SIM,
        userOwnerId: userOwner.id,
      },
    });

    userOwner.tenantId = tenant.id;

    await prisma.user.update({
      where: { id: userOwner.id },
      data: { tenantId: tenant.id },
    });

    console.log("Usuário proprietário criado:", userOwner);
    console.log("Tenant criado:", tenant);
  } catch (error) {
    console.error("Erro ao rodar o seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
