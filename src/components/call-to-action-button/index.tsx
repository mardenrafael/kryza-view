"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type CallToActionButtonProps = {
  href?: string;
};

export function CallToActionButton({ href = "#cta" }: CallToActionButtonProps) {
  return (
    <Link href={href}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition"
      >
        Quero ser parceiro
      </motion.button>
    </Link>
  );
}
