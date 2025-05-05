"use client";

import { commonAnimation } from "@/config/animation";
import { motion } from "framer-motion";
import { CallToActionButton } from "../call-to-action-button";

type CallToActionProps = {};

export function CallToAction({}: CallToActionProps) {
  return (
    <motion.section
      {...commonAnimation}
      id="cta"
      className="flex flex-col items-center space-y-6 text-center px-4"
    >
      <h2 className="text-3xl font-bold text-primary">
        Pronto para transformar sua corretagem?
      </h2>
      <p className="max-w-xl text-muted-foreground">
        Junte-se aos corretores que estão acelerando seus negócios com o Kryza.
        Cadastro rápido e benefícios exclusivos.
      </p>
      <CallToActionButton href="/signup" />
    </motion.section>
  );
}
