// src/app/[locale]/page.tsx

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import HeroSection from "@/components/home/HeroSection";
import UniversSection from "@/components/home/UniversSection";
import TrustSection from "@/components/home/TrustSection";
import ProduitsPhares from "@/components/home/ProduitsPhares";

export default function HomePage() {
  return (
    <main className="bg-[#f7f4ee] text-black">
      <HeroSection />

      <UniversSection />

      <TrustSection />

      <ProduitsPhares />

      <section className="bg-black px-6 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d7b86e]">
              Nouvelle collection
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              Créez votre salle de sport privée
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
              Découvrez notre sélection d&apos;équipements fitness haut de gamme :
              cardio, musculation, cross training et home gym premium.
            </p>

            <Link
              href="/fr/fitness"
              className="group mt-10 inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#d7b86e]"
            >
              Découvrir Fitness Premium
              <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl">
            <div className="aspect-[16/11] rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(215,184,110,0.28),rgba(255,255,255,0.08))]" />
          </div>
        </div>
      </section>
    </main>
  );
}