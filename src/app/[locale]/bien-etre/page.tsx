// src/app/[locale]/bien-etre/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Dumbbell,
  Flame,
  Goal,
  Trophy,
  Waves,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Collections outdoor | Tempel Outdoor",
  description:
    "Découvrez toutes les collections Tempel Outdoor : spas, saunas, billards, baby-foot et fitness extérieur haut de gamme.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CollectionsPage({ params }: Props) {
  const { locale } = await params;

  const collections = [
    {
      icon: Waves,
      title: "Spas extérieurs",
      description:
        "Des spas de nage et bains à remous conçus pour la détente, la récupération et les moments de partage.",
      href: `/${locale}/bien-etre/spa`,
    },
    {
      icon: Flame,
      title: "Saunas bois",
      description:
        "Des saunas extérieurs élégants en bois, pensés pour une expérience bien-être authentique toute l’année.",
      href: `/${locale}/bien-etre/sauna`,
    },
    {
      icon: Trophy,
      title: "Billards outdoor",
      description:
        "Des billards premium convertibles en table à manger, parfaits pour créer un espace convivial et élégant.",
      href: `/${locale}/loisirs/billard`,
    },
    {
      icon: Goal,
      title: "Baby-foot extérieur",
      description:
        "Des baby-foot haut de gamme pensés pour l’extérieur, avec des finitions robustes et un design intemporel.",
      href: `/${locale}/loisirs/baby-foot`,
    },
    {
      icon: Dumbbell,
      title: "Fitness outdoor",
      description:
        "Des équipements fitness premium pour aménager une salle de sport privée, intérieure ou extérieure.",
      href: `/${locale}/fitness`,
    },
  ];

  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b87932]">
            Collections
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            Toutes les collections Tempel Outdoor
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#5f5a54]">
            Explorez nos univers haut de gamme pour transformer votre jardin,
            terrasse ou espace privé en un lieu de bien-être, de jeu et de
            performance.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => {
            const Icon = collection.icon;

            return (
              <Link
                key={collection.title}
                href={collection.href}
                className="group rounded-[2rem] border border-[#e6ded1] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#181512] text-[#d7b86e]">
                  <Icon className="h-7 w-7" />
                </div>

                <h2 className="text-2xl font-semibold">{collection.title}</h2>

                <p className="mt-4 leading-8 text-[#5f5a54]">
                  {collection.description}
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