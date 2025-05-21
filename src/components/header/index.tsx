"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getSubdomain } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
            <HeaderActions />
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
            <HeaderActions />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeaderActions() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    const host = window.location.host;

    const isProd = process.env.NODE_ENV === "production";
    const protocol = isProd ? "https" : "http";

    const redirectUrl = `${protocol}://${host}`;

    await signOut({
      redirect: false,
    });

    router.push(redirectUrl);
  };

  return (
    <>
      {!session ? (
        <>
          <Link href="/login">
            <Button variant="outline" size="sm" className="cursor-pointer">
              Entrar
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="cursor-pointer">
              Cadastrar
            </Button>
          </Link>
        </>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </Button>
      )}
      <ThemeToggle />
    </>
  );
}
