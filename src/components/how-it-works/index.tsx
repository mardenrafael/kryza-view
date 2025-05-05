"use client";

import { commonAnimation } from "@/config/animation";
import { motion } from "framer-motion";

type HowItWorksProps = {};

export function HowItWorks({}: HowItWorksProps) {
  return (
    <motion.section
      {...commonAnimation}
      className="container mx-auto space-y-12 px-4"
    >
      <h2 className="text-3xl font-semibold text-center text-primary">
        Como o Kryza potencializa sua atuação
      </h2>
      <div className="grid md:grid-cols-3 gap-8 text-muted-foreground text-center">
        <div>
          <h3 className="text-xl font-semibold mb-2">Cadastro Inteligente</h3>
          <p>
            Registre imóveis em poucos minutos, com suporte para fotos,
            documentos e localização automática.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Análise Especializada</h3>
          <p>
            Solicite avaliações precisas com base em dados técnicos e
            profissionais de mercado.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Gestão Centralizada</h3>
          <p>
            Acompanhe todas as solicitações e imóveis em um painel único, de
            forma ágil e organizada.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
