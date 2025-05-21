/*
  Warnings:

  - You are about to drop the column `per_email` on the `persons` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "persons_per_email_key";

-- AlterTable
ALTER TABLE "persons" DROP COLUMN "per_email";
