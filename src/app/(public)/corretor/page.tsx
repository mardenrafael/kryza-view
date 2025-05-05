"use client";

import { Benefits } from "@/components/benefits";
import { CallToAction } from "@/components/call-to-action";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";

export default function LandingPage() {
  return (
    <div className="flex flex-col space-y-24">
      <Hero />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
