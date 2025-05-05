import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kryza | Solicite Análise do Seu Imóvel",
  description:
    "Crie pedidos de análise de imóvel de forma rápida, prática e segura com a Kryza.",
  keywords: ["Kryza", "Imóveis", "Análise de Imóveis", "Cadastro de Imóvel"],
  authors: [{ name: "Kryza Team" }],
  creator: "Kryza",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.kryza.com",
    title: "Kryza | Avaliação de Imóveis Online",
    description:
      "Solicite a avaliação do seu imóvel de forma rápida e prática.",
    siteName: "Kryza",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kryza | Avaliação de Imóveis Online",
    description: "Avalie seu imóvel com profissionais de forma simples.",
    creator: "@kryza",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
