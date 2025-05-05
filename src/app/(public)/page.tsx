"use client";

import { commonAnimation } from "@/config/animation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPageClienteFinal() {
  return (
    <div className="flex flex-col space-y-24">
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center space-y-6 px-4">
        <h1 className="text-4xl font-bold text-primary sm:text-5xl">
          Descubra o verdadeiro valor do seu imóvel com profissionais
          especializados.
        </h1>
        <p className="max-w-2xl text-muted-foreground text-lg">
          Cadastre-se gratuitamente e solicite uma avaliação confiável do seu
          imóvel em poucos cliques.
        </p>
        <CTAButton />
      </section>

      <motion.section
        {...commonAnimation}
        className="container mx-auto space-y-12 px-4"
      >
        <h2 className="text-3xl font-semibold text-center text-primary">
          Como funciona o Kryza?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-muted-foreground text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Cadastre-se gratuitamente
            </h3>
            <p>
              Crie sua conta em poucos segundos e acesse nossa plataforma
              exclusiva.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Preencha as informações do seu imóvel
            </h3>
            <p>
              Após login, você poderá enviar fotos e informações para solicitar
              a avaliação.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Receba uma avaliação profissional
            </h3>
            <p>
              Corretores credenciados analisarão seu imóvel com precisão e
              segurança.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        {...commonAnimation}
        className="container mx-auto space-y-12 px-4"
      >
        <h2 className="text-3xl font-semibold text-center text-primary">
          Por que confiar no Kryza?
        </h2>
        <ul className="grid md:grid-cols-2 gap-8 text-muted-foreground list-disc list-inside">
          <li>
            <span className="font-semibold text-foreground">
              Avaliação rápida e segura:
            </span>{" "}
            receba respostas em poucos dias.
          </li>
          <li>
            <span className="font-semibold text-foreground">
              Corretores especializados:
            </span>{" "}
            análises feitas por profissionais experientes.
          </li>
          <li>
            <span className="font-semibold text-foreground">
              Proteção de dados:
            </span>{" "}
            total sigilo e segurança das suas informações.
          </li>
          <li>
            <span className="font-semibold text-foreground">
              Serviço gratuito:
            </span>{" "}
            sem custos para solicitar sua avaliação inicial.
          </li>
        </ul>
      </motion.section>

      <motion.section
        id="cta"
        {...commonAnimation}
        className="flex flex-col items-center space-y-6 text-center px-4"
      >
        <h2 className="text-3xl font-bold text-primary">
          Avalie seu imóvel com quem entende do mercado.
        </h2>
        <p className="max-w-xl text-muted-foreground">
          Cadastre-se agora mesmo e tenha acesso gratuito à nossa plataforma
          exclusiva.
        </p>
        <CTAButton />
      </motion.section>

      <motion.section
        {...commonAnimation}
        className="container mx-auto text-center text-muted-foreground px-4"
      >
        <p className="text-sm">
          Seus dados estão protegidos com a gente. Seguimos rigorosamente as
          políticas de privacidade e proteção de dados.
        </p>
      </motion.section>
    </div>
  );
}

function CTAButton() {
  return (
    <Link href="/signup">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition"
      >
        Criar Conta
      </motion.button>
    </Link>
  );
}
