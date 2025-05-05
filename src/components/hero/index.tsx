"use client";

import { CallToActionButton } from "@/components/call-to-action-button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <motion.section
      ref={heroRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-[80vh] flex flex-col justify-center items-center text-center space-y-6 px-4"
    >
      <motion.h1
        style={{ y }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl font-bold text-primary sm:text-5xl"
      >
        Conecte-se ao futuro da corretagem de imóveis com o Kryza.
      </motion.h1>
      <motion.p
        style={{ y }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        className="max-w-2xl text-muted-foreground text-lg"
      >
        Uma plataforma completa para gestão, avaliação e captação de imóveis,
        pensada para corretores modernos.
      </motion.p>
      <motion.div
        style={{ y }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
      >
        <CallToActionButton />
      </motion.div>
    </motion.section>
  );
}
