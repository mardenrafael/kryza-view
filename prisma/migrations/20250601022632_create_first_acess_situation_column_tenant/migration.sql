-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "sts_id" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "tnt_first_access" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_sts_id_fkey" FOREIGN KEY ("sts_id") REFERENCES "situations"("sts_id") ON DELETE RESTRICT ON UPDATE CASCADE;
