"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full border-t border-border bg-background py-6"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 text-muted-foreground text-sm">
        <div className="mb-4 md:mb-0">
          © {new Date().getFullYear()} Kryza. Todos os direitos reservados.
        </div>

        <div className="flex space-x-6">
          <Link
            href="/termos"
            className="hover:underline hover:text-primary transition-colors"
          >
            Termos de Serviço
          </Link>
          <Link
            href="/privacidade"
            className="hover:underline hover:text-primary transition-colors"
          >
            Política de Privacidade
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}
