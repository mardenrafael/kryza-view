import "@/app/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background font-sans ${inter.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
