// src/app/[locale]/page.tsx

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import HeroSection from "@/components/home/HeroSection";
import UniversSection from "@/components/home/UniversSection";
import TrustSection from "@/components/home/TrustSection";
import ProduitsPhares from "@/components/home/ProduitsPhares";
import GoogleReviewsSection from "@/components/home/GoogleReviewsSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="bg-[#f7f4ee] text-black">
      <HeroSection locale={locale} />

      <UniversSection />

      <TrustSection />

      <ProduitsPhares />

      <section className="bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d7b86e]">
            Nouvelle collection
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Créez votre salle de sport privée
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/65">
            Découvrez notre sélection d&apos;équipements fitness haut de gamme :
            cardio, musculation, cross training et home gym premium.
          </p>

          <Link
            href={`/${locale}/fitness`}
            className="group mt-10 inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#d7b86e]"
          >
            Découvrir Fitness Premium
            <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <GoogleReviewsSection locale={locale} />
    </main>
  );
}