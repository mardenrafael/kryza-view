"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ThemeProviderProps as NextThemeProviderProps,
  ThemeProvider as NextThemesProvider,
  useTheme,
} from "next-themes";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

type ThemeProviderProps = PropsWithChildren & NextThemeProviderProps;

export const ThemeChangeContext = createContext({
  triggerChange: () => {},
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { resolvedTheme } = useTheme();
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [themeChangeTriggered, setThemeChangeTriggered] = useState(false);

  useEffect(() => {
    if (!themeChangeTriggered) return;

    setIsChangingTheme(true);
    setShowContent(false);

    const timer = setTimeout(() => {
      setIsChangingTheme(false);
      setShowContent(true);
      setThemeChangeTriggered(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [resolvedTheme, themeChangeTriggered]);

  const triggerChange = () => {
    setThemeChangeTriggered(true);
  };

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      <ThemeChangeContext.Provider value={{ triggerChange }}>
        <AnimatePresence mode="wait">
          {isChangingTheme && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
              <motion.div
                key="theme-change-background"
                initial={{ opacity: 0, scale: 1.05, filter: "blur(0px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(6px)" }}
                exit={{ opacity: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 bg-background "
              />
              <motion.div
                key="theme-change-spinner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showContent && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </ThemeChangeContext.Provider>
    </NextThemesProvider>
  );
}
