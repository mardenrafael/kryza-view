/*
  Warnings:

  - You are about to drop the column `pty_id` on the `properties` table. All the data in the column will be lost.
  - Added the required column `propertyTypeId` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_pty_id_fkey";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "pty_id",
ADD COLUMN     "propertyTypeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "propertytypes"("pty_id") ON DELETE RESTRICT ON UPDATE CASCADE;
