"use client";

import { commonAnimation } from "@/config/animation";
import { motion } from "framer-motion";

type BenefitsProps = {};

export function Benefits({}: BenefitsProps) {
  return (
    <motion.section
      {...commonAnimation}
      className="container mx-auto space-y-12 px-4"
    >
      <h2 className="text-3xl font-semibold text-center text-primary">
        Por que escolher o Kryza?
      </h2>
      <ul className="grid md:grid-cols-2 gap-8 text-muted-foreground list-disc list-inside">
        <li>
          <span className="font-semibold text-foreground">
            Captação Rápida:
          </span>{" "}
          Ganhe tempo e aumente suas oportunidades de venda.
        </li>
        <li>
          <span className="font-semibold text-foreground">
            Confiança no Processo:
          </span>{" "}
          Clientes valorizam a segurança de uma análise profissional.
        </li>
        <li>
          <span className="font-semibold text-foreground">
            Tecnologia de Ponta:
          </span>{" "}
          Plataforma intuitiva, segura e escalável.
        </li>
        <li>
          <span className="font-semibold text-foreground">
            Suporte Exclusivo:
          </span>{" "}
          Atendimento especializado para parceiros.
        </li>
        <li>
          <span className="font-semibold text-foreground">
            Marca Personalizável:
          </span>{" "}
          Trabalhe com sua identidade visual no modelo white-label.
        </li>
      </ul>
    </motion.section>
  );
}
