import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Droplets, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Spa extérieur haut de gamme | Tempel Outdoor",
  description:
    "Découvrez nos spas extérieurs de 2 à 7 places pour créer un espace de relaxation aquatique premium.",
};

export default function SpaPage() {
  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b87932]">
            Spa extérieur
          </p>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Le plaisir du spa à domicile, toute l’année
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5f5a54]">
            Profitez de spas de nage et bains à remous de 2 à 7 places,
            sélectionnés pour offrir confort, relaxation et convivialité dans
            votre jardin ou sur votre terrasse.
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
          <Feature icon={Users} title="2 à 7 places">
            Des modèles adaptés aux moments de détente en couple, en famille ou
            entre amis.
          </Feature>

          <Feature icon={Droplets} title="Relaxation aquatique">
            Une expérience idéale pour décompresser, récupérer et profiter d’un
            confort quotidien.
          </Feature>

          <Feature icon={ShieldCheck} title="Sélection premium">
            Des équipements pensés pour la durabilité, la sécurité et le confort
            d’utilisation.
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