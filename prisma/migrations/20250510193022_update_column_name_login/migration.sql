/*
  Warnings:

  - You are about to drop the column `usr_name` on the `users` table. All the data in the column will be lost.
  - Added the required column `usr_login` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "usr_name",
ADD COLUMN     "usr_login" TEXT NOT NULL;
