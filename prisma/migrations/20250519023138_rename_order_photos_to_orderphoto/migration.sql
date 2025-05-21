/*
  Warnings:

  - You are about to drop the `order_photos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_photos" DROP CONSTRAINT "order_photos_ord_id_fkey";

-- DropTable
DROP TABLE "order_photos";

-- CreateTable
CREATE TABLE "orderphotos" (
    "oph_id" TEXT NOT NULL,
    "ord_id" TEXT NOT NULL,
    "oph_url" TEXT NOT NULL,
    "oph_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orderphotos_pkey" PRIMARY KEY ("oph_id")
);

-- AddForeignKey
ALTER TABLE "orderphotos" ADD CONSTRAINT "orderphotos_ord_id_fkey" FOREIGN KEY ("ord_id") REFERENCES "orders"("ord_id") ON DELETE RESTRICT ON UPDATE CASCADE;
