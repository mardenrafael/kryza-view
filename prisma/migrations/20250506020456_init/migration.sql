-- CreateTable
CREATE TABLE "tenants" (
    "tnt_id" TEXT NOT NULL,
    "tnt_name" TEXT NOT NULL,
    "tnt_slug" TEXT NOT NULL,
    "tnt_domain" TEXT,
    "tnt_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("tnt_id")
);

-- CreateTable
CREATE TABLE "users" (
    "usr_id" TEXT NOT NULL,
    "usr_email" TEXT NOT NULL,
    "usr_password" TEXT NOT NULL,
    "tnt_id" TEXT NOT NULL,
    "usr_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("usr_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_tnt_slug_key" ON "tenants"("tnt_slug");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_tnt_domain_key" ON "tenants"("tnt_domain");

-- CreateIndex
CREATE UNIQUE INDEX "users_usr_email_key" ON "users"("usr_email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tnt_id_fkey" FOREIGN KEY ("tnt_id") REFERENCES "tenants"("tnt_id") ON DELETE RESTRICT ON UPDATE CASCADE;
