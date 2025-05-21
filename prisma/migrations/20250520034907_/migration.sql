/*
  Warnings:

  - You are about to drop the `orderphotos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[prp_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prp_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orderphotos" DROP CONSTRAINT "orderphotos_ord_id_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "prp_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "userTypeId" INTEGER NOT NULL DEFAULT 3;

-- DropTable
DROP TABLE "orderphotos";

-- CreateTable
CREATE TABLE "usertypes" (
    "uty_id" SERIAL NOT NULL,
    "uty_name" TEXT NOT NULL,
    "uty_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uty_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usertypes_pkey" PRIMARY KEY ("uty_id")
);

-- CreateTable
CREATE TABLE "propertytypes" (
    "pty_id" SERIAL NOT NULL,
    "pty_name" TEXT NOT NULL,
    "pty_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pty_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "propertytypes_pkey" PRIMARY KEY ("pty_id")
);

-- CreateTable
CREATE TABLE "properties" (
    "prp_id" TEXT NOT NULL,
    "prp_description" TEXT NOT NULL,
    "prp_address_street" TEXT NOT NULL,
    "prp_address_number" TEXT NOT NULL,
    "prp_address_complement" TEXT,
    "prp_address_city" TEXT NOT NULL,
    "prp_address_state" TEXT NOT NULL,
    "prp_address_zip_code" TEXT NOT NULL,
    "prp_total_area" DOUBLE PRECISION NOT NULL,
    "prp_construction_year" INTEGER,
    "prp_price" DECIMAL(12,2) NOT NULL,
    "prp_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prp_updated_at" TIMESTAMP(3) NOT NULL,
    "usr_id" TEXT NOT NULL,
    "tnt_id" TEXT NOT NULL,
    "pty_id" INTEGER NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("prp_id")
);

-- CreateTable
CREATE TABLE "propertyimages" (
    "pri_id" TEXT NOT NULL,
    "pri_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pri_updated_at" TIMESTAMP(3) NOT NULL,
    "prp_id" TEXT NOT NULL,
    "img_id" TEXT NOT NULL,

    CONSTRAINT "propertyimages_pkey" PRIMARY KEY ("pri_id")
);

-- CreateTable
CREATE TABLE "images" (
    "img_id" TEXT NOT NULL,
    "img_url" TEXT NOT NULL,
    "img_description" TEXT,
    "img_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "img_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("img_id")
);

-- CreateTable
CREATE TABLE "persons" (
    "per_id" TEXT NOT NULL,
    "per_firstname" TEXT NOT NULL,
    "per_lastname" TEXT NOT NULL,
    "per_email" TEXT NOT NULL,
    "per_phone" TEXT NOT NULL,
    "per_birthdate" TIMESTAMP(3) NOT NULL,
    "per_cpf" TEXT NOT NULL,
    "per_rg" TEXT NOT NULL,
    "per_nationality" TEXT NOT NULL,
    "per_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "per_updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("per_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usertypes_uty_name_key" ON "usertypes"("uty_name");

-- CreateIndex
CREATE UNIQUE INDEX "propertytypes_pty_name_key" ON "propertytypes"("pty_name");

-- CreateIndex
CREATE UNIQUE INDEX "persons_per_email_key" ON "persons"("per_email");

-- CreateIndex
CREATE UNIQUE INDEX "persons_per_cpf_key" ON "persons"("per_cpf");

-- CreateIndex
CREATE UNIQUE INDEX "persons_per_rg_key" ON "persons"("per_rg");

-- CreateIndex
CREATE UNIQUE INDEX "persons_userId_key" ON "persons"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_prp_id_key" ON "orders"("prp_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_userTypeId_fkey" FOREIGN KEY ("userTypeId") REFERENCES "usertypes"("uty_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_usr_id_fkey" FOREIGN KEY ("usr_id") REFERENCES "users"("usr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_tnt_id_fkey" FOREIGN KEY ("tnt_id") REFERENCES "tenants"("tnt_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_pty_id_fkey" FOREIGN KEY ("pty_id") REFERENCES "propertytypes"("pty_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_prp_id_fkey" FOREIGN KEY ("prp_id") REFERENCES "properties"("prp_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propertyimages" ADD CONSTRAINT "propertyimages_prp_id_fkey" FOREIGN KEY ("prp_id") REFERENCES "properties"("prp_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propertyimages" ADD CONSTRAINT "propertyimages_img_id_fkey" FOREIGN KEY ("img_id") REFERENCES "images"("img_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("usr_id") ON DELETE RESTRICT ON UPDATE CASCADE;
