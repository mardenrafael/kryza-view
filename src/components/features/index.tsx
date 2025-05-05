"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Upload Fácil",
    description: "Envie fotos do seu imóvel em poucos cliques.",
  },
  {
    title: "Avaliação Profissional",
    description: "Especialistas revisam e analisam cada detalhe.",
  },
  {
    title: "Resultado Rápido",
    description: "Receba retorno sobre seu pedido sem demora.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <CardTitle className="text-2xl font-semibold mb-2">
                {feature.title}
              </CardTitle>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
