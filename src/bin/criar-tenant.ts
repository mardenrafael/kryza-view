import inquirer from "inquirer";
import { PrismaClient } from "../app/generated/prisma";

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  const { name, slug, domain } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Digite o nome do usuário",
    },
    {
      type: "input",
      name: "slug",
      message: "Digite o slug do usuário",
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

    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug,
        domain,
      },
    });

    console.log("Tenant criado:", tenant);
  } catch (error) {
    console.error("Erro ao rodar o seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
