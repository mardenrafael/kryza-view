"use client";

import { ThemeChangeContext } from "@/providers/theme-provider";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useContext, useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  const { triggerChange } = useContext(ThemeChangeContext);

  const toggleTheme = () => {
    triggerChange();
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    }, 300);
  };

  useEffect(() => {
    if (!mounted) return;

    setIsChangingTheme(true);
    const timer = setTimeout(() => {
      setIsChangingTheme(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [resolvedTheme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <motion.button
        whileTap={{ rotate: 360 }}
        onClick={toggleTheme}
        className="p-2 rounded-md border border-border"
      >
        <motion.div
          animate={isChangingTheme ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
            repeat: isChangingTheme ? Infinity : 0,
          }}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-primary" />
          ) : (
            <Moon className="w-5 h-5 text-primary" />
          )}
        </motion.div>
      </motion.button>
    )
  );
}
