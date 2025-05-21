import { PrismaClient } from "../src/app/generated/prisma";
import { Situation } from "../src/dd/situation";
import { PropertyType } from "../src/dd/property-type";
import { UserType } from "../src/dd/user-type";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando o seed...");
  const existingSituation = await prisma.situation.findMany();

  const createSituations = Situation.filter(
    (situation) =>
      !existingSituation.some((existing) => existing.id === situation.id)
  );

  if (createSituations.length > 0) {
    await prisma.situation.createMany({
      data: createSituations,
    });
    console.log("✅ Situations criadas com sucesso!");
  } else {
    console.log("ℹ️ Situations já existem no banco de dados.");
  }

  const existingPropertyTypes = await prisma.propertyType.findMany();
  const createPropertyType = PropertyType.filter(
    (propertyType) =>
      !existingPropertyTypes.some((existing) => existing.id === propertyType.id)
  );

  if (createPropertyType.length > 0) {
    await prisma.propertyType.createMany({
      data: createPropertyType,
    });
    console.log("✅ PropertyTypes criadas com sucesso!");
  } else {
    console.log("ℹ️ PropertyTypes já existem no banco de dados.");
  }

  const existingUserType = await prisma.userType.findMany();
  const createUserType = UserType.filter(
    (userType) =>
      !existingUserType.some((existing) => existing.id === userType.id)
  );

  if (createUserType.length > 0) {
    await prisma.userType.createMany({
      data: createUserType,
    });
    console.log("✅ UserType criadas com sucesso!");
  } else {
    console.log("ℹ️ UserType já existem no banco de dados.");
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    //@ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("✅ Prisma client desconectado com sucesso!");
  });
