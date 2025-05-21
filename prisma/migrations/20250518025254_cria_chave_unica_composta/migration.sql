/*
  Warnings:

  - A unique constraint covering the columns `[usr_email,tnt_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_usr_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "users_usr_email_tnt_id_key" ON "users"("usr_email", "tnt_id");
