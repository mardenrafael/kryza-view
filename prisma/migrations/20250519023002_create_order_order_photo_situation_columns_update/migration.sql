-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "tnt_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "usr_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "orders" (
    "ord_id" TEXT NOT NULL,
    "usr_id" TEXT NOT NULL,
    "tnt_id" TEXT NOT NULL,
    "sts_id" TEXT NOT NULL,
    "ord_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ord_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("ord_id")
);

-- CreateTable
CREATE TABLE "situations" (
    "sts_id" TEXT NOT NULL,
    "sts_name" TEXT NOT NULL,
    "sts_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "situations_pkey" PRIMARY KEY ("sts_id")
);

-- CreateTable
CREATE TABLE "order_photos" (
    "oph_id" TEXT NOT NULL,
    "ord_id" TEXT NOT NULL,
    "oph_url" TEXT NOT NULL,
    "oph_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_photos_pkey" PRIMARY KEY ("oph_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "situations_sts_name_key" ON "situations"("sts_name");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_usr_id_fkey" FOREIGN KEY ("usr_id") REFERENCES "users"("usr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_tnt_id_fkey" FOREIGN KEY ("tnt_id") REFERENCES "tenants"("tnt_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_sts_id_fkey" FOREIGN KEY ("sts_id") REFERENCES "situations"("sts_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_photos" ADD CONSTRAINT "order_photos_ord_id_fkey" FOREIGN KEY ("ord_id") REFERENCES "orders"("ord_id") ON DELETE RESTRICT ON UPDATE CASCADE;
