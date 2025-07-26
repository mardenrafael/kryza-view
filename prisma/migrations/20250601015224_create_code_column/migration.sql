/*
  Warnings:

  - A unique constraint covering the columns `[ord_code]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ord_code` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "ord_code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_ord_code_key" ON "orders"("ord_code");
