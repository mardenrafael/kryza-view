/*
  Warnings:

  - Added the required column `usr_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "usr_name" TEXT NOT NULL;
