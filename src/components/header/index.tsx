"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold text-primary">
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Cadastrar</Button>
            </Link>
            <ThemeToggle />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-md border border-border"
              whileTap={{ rotate: 360 }}
            >
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <X className="w-6 h-6 text-primary" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Menu className="w-6 h-6 text-primary" />
                </motion.div>
              )}
            </motion.button>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="flex flex-col items-center gap-4 overflow-hidden md:hidden px-4 pb-4"
          >
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                Entrar
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)}>
              <Button size="sm" className="w-full">
                Cadastrar
              </Button>
            </Link>
            <ThemeToggle />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
