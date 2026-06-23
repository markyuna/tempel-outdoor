import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Dumbbell, ShieldCheck, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Fitness premium à domicile | Tempel Outdoor",
  description:
    "Découvrez nos équipements fitness premium pour créer un espace d’entraînement confortable et performant à domicile.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FitnessPage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b87932]">
            Fitness premium
          </p>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Votre espace d’entraînement haut de gamme à domicile
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5f5a54]">
            Tempel Outdoor sélectionne des équipements fitness premium pour
            créer un environnement d’entraînement confortable, performant et
            esthétique chez vous.
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#181512] px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-[#2b241f]"
          >
            Demander un conseil
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <Feature icon={Dumbbell} title="Performance">
            Des équipements pensés pour accompagner vos entraînements réguliers
            avec confort et efficacité.
          </Feature>

          <Feature icon={Target} title="Objectifs personnels">
            Aménagez un espace adapté à votre rythme, votre niveau et votre
            style de vie.
          </Feature>

          <Feature icon={ShieldCheck} title="Sélection durable">
            Des produits premium choisis pour leur robustesse, leur design et
            leur qualité d’usage.
          </Feature>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[2rem] border border-[#e6ded1] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#181512] text-[#d7b86e]">
        <Icon className="h-7 w-7" />
      </div>

      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-4 leading-7 text-[#5f5a54]">{children}</p>
    </article>
  );
}