-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "ord_name" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "prp_address_neighborhood" TEXT NOT NULL DEFAULT '';
