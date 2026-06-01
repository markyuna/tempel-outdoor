// src/app/[locale]/page.tsx

import { ArrowRight, Dumbbell, Gem, Waves, Wine } from "lucide-react";
import Link from "next/link";

const universes = [
  {
    title: "Bien-être",
    description: "Spas, spas de nage et saunas haut de gamme.",
    href: "/fr/bien-etre",
    icon: Waves,
  },
  {
    title: "Loisirs",
    description: "Billards, baby-foot et jeux outdoor premium.",
    href: "/fr/loisirs",
    icon: Wine,
  },
  {
    title: "Fitness",
    description: "Équipements professionnels pour votre salle privée.",
    href: "/fr/fitness",
    icon: Dumbbell,
  },
  {
    title: "Réalisations",
    description: "Inspirez-vous de nos projets clients.",
    href: "/fr/realisations",
    icon: Gem,
  },
];

export default function HomePage() {
  return (
    <main className="bg-[#f7f4ee] text-black">
      <section className="relative flex min-h-[82vh] items-center overflow-hidden bg-black px-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,184,110,0.28),transparent_40%),linear-gradient(90deg,rgba(0,0,0,0.95),rgba(0,0,0,0.55))]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.35em] text-[#d7b86e]">
              Bien-être · Loisirs · Fitness
            </p>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              Transformez votre extérieur en espace d’exception
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Spas, saunas, billards, baby-foot et équipements fitness premium
              pour créer un lieu unique dédié à la détente, au partage et à la
              performance.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/fr/bien-etre"
                className="inline-flex items-center justify-center rounded-full bg-[#d7b86e] px-8 py-4 text-sm font-semibold text-black transition hover:bg-white"
              >
                Découvrir nos collections
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/fr/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-sm font-semibold text-white transition hover:border-[#d7b86e] hover:text-[#d7b86e]"
              >
                Parler à un conseiller
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="aspect-[4/5] rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(215,184,110,0.35),rgba(255,255,255,0.08)),url('/images/hero-tempel.jpg')] bg-cover bg-center" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#a8793e]">
              Nos univers
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold md:text-5xl">
              Une sélection premium pour chaque espace de vie
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-black/60">
            Tempel Outdoor réunit les meilleurs équipements pour créer des
            espaces extérieurs élégants, fonctionnels et durables.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {universes.map((universe) => {
            const Icon = universe.icon;

            return (
              <Link
                key={universe.title}
                href={universe.href}
                className="group rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-black text-[#d7b86e]">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-2xl font-semibold">{universe.title}</h3>
                <p className="mt-4 text-sm leading-6 text-black/60">
                  {universe.description}
                </p>

                <span className="mt-8 inline-flex items-center text-sm font-semibold text-[#a8793e]">
                  Découvrir
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-black px-6 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d7b86e]">
              Nouvelle collection
            </p>

            <h2 className="mt-4 text-4xl font-semibold md:text-6xl">
              Créez votre salle de sport privée
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
              Découvrez notre sélection d’équipements fitness haut de gamme :
              cardio, musculation, cross training et home gym premium.
            </p>

            <Link
              href="/fr/fitness"
              className="mt-10 inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition hover:bg-[#d7b86e]"
            >
              Découvrir Fitness Premium
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4">
            <div className="aspect-[16/11] rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(215,184,110,0.28),rgba(255,255,255,0.08))]" />
          </div>
        </div>
      </section>
    </main>
  );
}