// src/components/home/HeroSection.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/hero-tempel.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,184,110,0.18),transparent_35%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.35em] text-[#d7b86e]">
            Bien-être · Loisirs · Fitness
          </p>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Transformez votre extérieur en espace d&apos;exception
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/80">
            Spas, saunas, billards, baby-foot et équipements fitness premium
            sélectionnés pour créer un lieu unique dédié au bien-être, au
            partage et à la performance.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/fr/bien-etre"
              className="group inline-flex items-center justify-center rounded-full bg-[#d7b86e] px-8 py-4 text-sm font-semibold text-black shadow-[0_20px_60px_rgba(215,184,110,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Découvrir nos collections
              <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/fr/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#d7b86e] hover:text-[#d7b86e]"
            >
              Parler à un conseiller
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}