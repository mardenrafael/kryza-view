/*
  Warnings:

  - The primary key for the `situations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `sts_id` column on the `situations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `sts_id` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_sts_id_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "sts_id",
ADD COLUMN     "sts_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "situations" DROP CONSTRAINT "situations_pkey",
DROP COLUMN "sts_id",
ADD COLUMN     "sts_id" SERIAL NOT NULL,
ADD CONSTRAINT "situations_pkey" PRIMARY KEY ("sts_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_sts_id_fkey" FOREIGN KEY ("sts_id") REFERENCES "situations"("sts_id") ON DELETE RESTRICT ON UPDATE CASCADE;
