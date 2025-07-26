/*
  Warnings:

  - A unique constraint covering the columns `[usr_owner_id]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usr_owner_id` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_tnt_id_fkey";

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "usr_owner_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "tnt_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tenants_usr_owner_id_key" ON "tenants"("usr_owner_id");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_usr_owner_id_fkey" FOREIGN KEY ("usr_owner_id") REFERENCES "users"("usr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tnt_id_fkey" FOREIGN KEY ("tnt_id") REFERENCES "tenants"("tnt_id") ON DELETE SET NULL ON UPDATE CASCADE;
