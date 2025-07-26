/*
  Warnings:

  - You are about to drop the column `propertyTypeId` on the `properties` table. All the data in the column will be lost.
  - Added the required column `pty_id` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_propertyTypeId_fkey";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "propertyTypeId",
ADD COLUMN     "pty_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_pty_id_fkey" FOREIGN KEY ("pty_id") REFERENCES "propertytypes"("pty_id") ON DELETE RESTRICT ON UPDATE CASCADE;
