import "@/app/globals.css";
import { auth } from "@/lib/auth";
import { TenantProvider } from "@/providers/tenant-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Kryza",
    template: "%s | Kryza",
  },
  description:
    "Solicite a análise do seu imóvel de forma rápida, prática e segura com a Kryza.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background font-sans ${inter.variable}`}
      >
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TenantProvider>
              <Toaster richColors />
              {children}
            </TenantProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
