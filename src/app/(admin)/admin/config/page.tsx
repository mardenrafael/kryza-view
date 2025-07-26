"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TenantBrandingData } from "@/service/tenant-admin-service";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTenant } from "@/providers/tenant-provider";

export default function ConfigPage() {
  const { data: session, status } = useSession();
  console.log("Session hook:", { session, status });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [formData, setFormData] = useState<TenantBrandingData>({
    tenantId: "",
    primaryColor: "#d7263d", // Vermelho padrão do sistema
    secondaryColor: "#f9fafb", // Cinza claro padrão
    accentColor: "#1f2937", // Cinza escuro padrão
    companyName: "",
    companySlogan: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    logoUrl: "",
    faviconUrl: "",
    socialMedia: {},
  });
  const { setBranding } = useTenant();

  useEffect(() => {
    console.log("useEffect disparado", { session, status, tenantId: session?.tenantId });
    if (session?.tenantId) {
      loadBrandingData();
      checkFirstAccess();
    }
  }, [session, status]);

  const checkFirstAccess = async () => {
    try {
      if (session?.tenantId) {
        console.log("Verificando firstAccess para", session.tenantId);
        const response = await api.get(`/api/tenant/first-access?tenantId=${session.tenantId}`);
        const { firstAccess } = response.data;
        setIsFirstAccess(firstAccess);
        console.log("Resultado firstAccess:", firstAccess);
      }
    } catch (error) {
      console.error("Erro ao verificar primeiro acesso:", error);
    }
  };

  const loadBrandingData = async () => {
    try {
      setLoading(true);
      console.log("Iniciando loadBrandingData", session?.tenantId);
      if (session?.tenantId) {
        const response = await api.get(`/api/tenant/branding?tenantId=${session.tenantId}`);
        const branding = response.data;
        console.log("Branding retornado:", branding);
        
        if (branding) {
          setFormData({
            ...branding,
            tenantId: session.tenantId as string,
          });
        } else {
          // Configuração padrão baseada no globals.css
          setFormData({
            tenantId: session.tenantId as string,
            primaryColor: "#d7263d", // Vermelho principal do sistema
            secondaryColor: "#f9fafb", // Cinza claro
            accentColor: "#1f2937", // Cinza escuro
            companyName: "",
            companySlogan: "",
            contactEmail: "",
            contactPhone: "",
            address: "",
            logoUrl: "",
            faviconUrl: "",
            socialMedia: {},
          });
        }
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error("Erro ao carregar configuração de branding:", error);
      }
      // Se for 404, mantém a configuração padrão
    } finally {
      setLoading(false);
      console.log("Finalizou loading");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (session?.tenantId) {
        const method = formData.tenantId ? "put" : "post";
        await api[method]("/api/tenant/branding", {
          ...formData,
          tenantId: session.tenantId as string,
        });
        // Atualiza o contexto imediatamente após salvar
        const { data: newBranding } = await api.get(`/api/tenant/branding?tenantId=${session.tenantId}`);
        setBranding(newBranding);
        // Se for primeiro acesso, marcar como concluído e redirecionar
        if (isFirstAccess) {
          await api.put("/api/tenant/first-access", {
            tenantId: session.tenantId as string,
          });
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      console.error("Erro ao salvar configuração de branding:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof TenantBrandingData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isFirstAccess && (
        <Card className="border-secondary bg-card">
          <CardContent >
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <p className="text-card-foreground font-medium">
                Bem-vindo! Configure o branding do seu sistema para começar.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h1 className="text-3xl font-bold">
          {isFirstAccess ? "Configuração Inicial" : "Configurações do Sistema"}
        </h1>
        <p className="text-muted-foreground">
          {isFirstAccess 
            ? "Personalize as cores e informações da sua empresa"
            : "Gerencie as configurações de branding do seu sistema"
          }
        </p>
      </div>

      <div className="space-y-6">
        {/* Informações da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
            <CardDescription>
              Configure o nome, slogan e informações de contato da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Nome da sua empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySlogan">Slogan</Label>
                <Input
                  id="companySlogan"
                  value={formData.companySlogan || ""}
                  onChange={(e) => handleInputChange("companySlogan", e.target.value)}
                  placeholder="Slogan da empresa"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de Contato</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  placeholder="contato@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Telefone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone || ""}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Endereço completo da empresa"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cores */}
        <Card>
          <CardHeader>
            <CardTitle>Paleta de Cores</CardTitle>
            <CardDescription>
              Defina as cores principais do seu sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorPicker
                label="Cor Primária"
                value={formData.primaryColor}
                onChange={(color) => handleInputChange("primaryColor", color)}
                placeholder="#d7263d"
              />
              <ColorPicker
                label="Cor Secundária"
                value={formData.secondaryColor}
                onChange={(color) => handleInputChange("secondaryColor", color)}
                placeholder="#f9fafb"
              />
              <ColorPicker
                label="Cor de Destaque"
                value={formData.accentColor}
                onChange={(color) => handleInputChange("accentColor", color)}
                placeholder="#1f2937"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logos e Imagens */}
        <Card>
          <CardHeader>
            <CardTitle>Logos e Imagens</CardTitle>
            <CardDescription>
              URLs das imagens do logo e favicon da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL do Logo</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl || ""}
                  onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faviconUrl">URL do Favicon</Label>
                <Input
                  id="faviconUrl"
                  value={formData.faviconUrl || ""}
                  onChange={(e) => handleInputChange("faviconUrl", e.target.value)}
                  placeholder="https://exemplo.com/favicon.ico"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>
              Links para as redes sociais da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.socialMedia?.facebook || ""}
                  onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                  placeholder="https://facebook.com/empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.socialMedia?.instagram || ""}
                  onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                  placeholder="https://instagram.com/empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.socialMedia?.linkedin || ""}
                  onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/company/empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input
                  id="twitter"
                  value={formData.socialMedia?.twitter || ""}
                  onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                  placeholder="https://twitter.com/empresa"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2 pt-6">
        {!isFirstAccess && (
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancelar
          </Button>
        )}
        <Button 
          onClick={handleSave} 
          disabled={saving || !formData.companyName}
          className="min-w-[120px]"
        >
          {saving ? "Salvando..." : isFirstAccess ? "Começar" : "Salvar Configuração"}
        </Button>
      </div>
    </div>
  );
}
