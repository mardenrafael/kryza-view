"use client";

import { commonAnimation } from "@/config/animation";
import { motion } from "framer-motion";

type TestimonialsProps = {};

export function Testimonials({}: TestimonialsProps) {
  return (
    <motion.section
      {...commonAnimation}
      className="container mx-auto space-y-12 px-4 text-center"
    >
      <h2 className="text-3xl font-semibold text-primary">
        O que dizem nossos parceiros
      </h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center text-muted-foreground">
        <div className="max-w-md">
          <p className="italic">
            “O Kryza revolucionou meu trabalho como corretor. Agora consigo
            entregar avaliações com agilidade e precisão.”
          </p>
          <p className="mt-2 font-semibold text-foreground">
            João Pereira, Corretor de Imóveis
          </p>
        </div>
        <div className="max-w-md">
          <p className="italic">
            “Com o Kryza, meus clientes passaram a confiar muito mais no
            processo de venda. A captação ficou mais assertiva.”
          </p>
          <p className="mt-2 font-semibold text-foreground">
            Mariana Lopes, Especialista em Imóveis Comerciais
          </p>
        </div>
      </div>
    </motion.section>
  );
}
