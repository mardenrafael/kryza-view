/*
  Warnings:

  - You are about to drop the column `usr_login` on the `users` table. All the data in the column will be lost.
  - Added the required column `usr_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "usr_login",
ADD COLUMN     "usr_name" TEXT NOT NULL;
