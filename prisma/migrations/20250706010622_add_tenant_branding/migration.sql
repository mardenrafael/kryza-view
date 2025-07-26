-- CreateTable
CREATE TABLE "tenant_branding" (
    "tbr_id" TEXT NOT NULL,
    "tbr_primary_color" TEXT NOT NULL DEFAULT '#000000',
    "tbr_secondary_color" TEXT NOT NULL DEFAULT '#ffffff',
    "tbr_accent_color" TEXT NOT NULL DEFAULT '#3b82f6',
    "tbr_logo_url" TEXT,
    "tbr_favicon_url" TEXT,
    "tbr_company_name" TEXT NOT NULL,
    "tbr_company_slogan" TEXT,
    "tbr_contact_email" TEXT,
    "tbr_contact_phone" TEXT,
    "tbr_address" TEXT,
    "tbr_social_media" JSONB,
    "tbr_custom_css" TEXT,
    "tbr_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tbr_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tnt_id" TEXT NOT NULL,

    CONSTRAINT "tenant_branding_pkey" PRIMARY KEY ("tbr_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_branding_tnt_id_key" ON "tenant_branding"("tnt_id");

-- AddForeignKey
ALTER TABLE "tenant_branding" ADD CONSTRAINT "tenant_branding_tnt_id_fkey" FOREIGN KEY ("tnt_id") REFERENCES "tenants"("tnt_id") ON DELETE CASCADE ON UPDATE CASCADE;
