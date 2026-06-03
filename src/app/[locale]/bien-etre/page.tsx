import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flame, Waves } from "lucide-react";

export const metadata: Metadata = {
  title: "Bien-être extérieur | Tempel Outdoor",
  description:
    "Découvrez nos spas et saunas extérieurs haut de gamme pour créer un espace bien-être premium chez vous.",
};

const categories = [
  {
    icon: Waves,
    title: "Spas extérieurs",
    description:
      "Des spas de nage et bains à remous conçus pour la détente, la récupération et les moments de partage.",
    href: "/fr/bien-etre/spa",
  },
  {
    icon: Flame,
    title: "Saunas bois",
    description:
      "Des saunas extérieurs élégants en bois, pensés pour une expérience bien-être authentique toute l’année.",
    href: "/fr/bien-etre/sauna",
  },
];

export default function BienEtrePage() {
  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b87932]">
            Bien-être
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            Créez votre espace détente en extérieur
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#5f5a54]">
            Tempel Outdoor sélectionne des spas et saunas extérieurs haut de
            gamme pour transformer votre jardin, terrasse ou espace privé en un
            véritable lieu de relaxation.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href={category.href}
                className="group rounded-[2rem] border border-[#e6ded1] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#181512] text-[#d7b86e]">
                  <Icon className="h-7 w-7" />
                </div>

                <h2 className="text-2xl font-semibold">{category.title}</h2>

                <p className="mt-4 leading-8 text-[#5f5a54]">
                  {category.description}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#b87932]">
                  Découvrir
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}