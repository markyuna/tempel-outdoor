import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flame, Leaf, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Sauna extérieur bois haut de gamme | Tempel Outdoor",
  description:
    "Découvrez nos saunas extérieurs en bois, de 2 à 10 places, avec chauffage électrique ou bois.",
};

export default function SaunaPage() {
  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b87932]">
            Sauna bois
          </p>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Une parenthèse bien-être au cœur de votre extérieur
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5f5a54]">
            Nos saunas extérieurs de 2 à 10 places sont conçus en épicéa ou
            thermo-bois, avec des options de chauffage électrique ou bois pour
            une expérience authentique et élégante.
          </p>

          <Link
            href="/fr/contact"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#181512] px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-[#2b241f]"
          >
            Demander un conseil
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <Feature icon={Leaf} title="Bois sélectionné">
            Épicéa ou thermo-bois pour une esthétique naturelle, chaleureuse et
            durable.
          </Feature>

          <Feature icon={Flame} title="Chauffage adapté">
            Choisissez entre chauffage électrique ou bois selon votre usage et
            votre ambiance préférée.
          </Feature>

          <Feature icon={ShieldCheck} title="Confort premium">
            Des saunas conçus pour le bien-être, la relaxation et les moments de
            détente toute l’année.
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