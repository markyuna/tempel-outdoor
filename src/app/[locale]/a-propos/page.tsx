import type { Metadata } from "next";
import Link from "next/link";
import { buildAlternates, buildOg } from "@/lib/seo";

type MetaProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const { locale } = await params;
  const title = "À propos — Tempel Outdoor";
  const description =
    "Découvrez l'histoire et les valeurs de Tempel Outdoor, spécialiste du spa, sauna, loisirs et fitness premium en France.";
  return {
    title,
    description,
    alternates: buildAlternates(locale, "/a-propos"),
    openGraph: buildOg({ title, description, locale }),
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

const univers = [
  {
    name: "Spa & Jacuzzi",
    desc: "Hydrothérapie et relaxation — modèles intérieurs et extérieurs de 2 à 7 places.",
  },
  {
    name: "Sauna & Hammam",
    desc: "Chaleur sèche ou vapeur, en épicéa ou thermo-bois, pour profiter toute l'année.",
  },
  {
    name: "Baby-foot & Billard",
    desc: "Tables de compétition et finitions premium pour vos espaces de loisirs.",
  },
  {
    name: "Fitness Premium",
    desc: "Cardio, musculation, cross training et home gym — équipements professionnels chez vous.",
  },
];

const engagements = [
  {
    label: "Sélection rigoureuse",
    text: "Chaque produit est évalué sur ses matériaux, sa durabilité et ses performances avant d'intégrer notre catalogue.",
  },
  {
    label: "Conseil personnalisé",
    text: "Nous accompagnons chaque client dans le choix du produit adapté à son espace, son usage et son budget.",
  },
  {
    label: "Livraison en France",
    text: "Livraison coordonnée partout en France métropolitaine, avec suivi de commande dédié.",
  },
];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="bg-[#f7f4ee]">
      {/* Header */}
      <section className="bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7b86e]">
            À propos
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Tempel Outdoor
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
            Spécialiste du bien-être et des loisirs premium, nous sélectionnons
            des équipements haut de gamme pour transformer vos espaces en lieux
            de vie d&apos;exception.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-4 px-6 py-10">
        {/* Notre histoire */}
        <div className="rounded-2xl border border-black/8 bg-white px-7 py-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7b86e]">
            Notre histoire
          </h2>
          <p className="mt-4 text-sm leading-7 text-neutral-600">
            Née de la passion pour les espaces de vie bien conçus, Tempel Outdoor
            s&apos;est construite autour d&apos;une conviction simple : le bien-être et le
            plaisir méritent des équipements à la hauteur. Nous travaillons avec
            des fabricants sélectionnés pour leur rigueur technique et leurs
            finitions irréprochables.
          </p>
          <p className="mt-3 text-sm leading-7 text-neutral-600">
            Basée en Normandie, notre équipe accompagne des particuliers et des
            professionnels partout en France métropolitaine, de la sélection du
            produit à la livraison.
          </p>
        </div>

        {/* Nos univers */}
        <div className="rounded-2xl border border-black/8 bg-white px-7 py-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7b86e]">
            Nos univers
          </h2>
          <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-black/8 bg-black/8 sm:grid-cols-2">
            {univers.map((u) => (
              <div key={u.name} className="bg-white px-5 py-4">
                <p className="text-sm font-semibold text-neutral-900">{u.name}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagements */}
        <div className="rounded-2xl border border-black/8 bg-white px-7 py-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7b86e]">
            Nos engagements
          </h2>
          <div className="mt-4 divide-y divide-black/8">
            {engagements.map((e) => (
              <div key={e.label} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d7b86e]" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{e.label}</p>
                  <p className="mt-0.5 text-sm leading-6 text-neutral-500">{e.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-black/8 bg-white px-7 py-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7b86e]">
            Nous contacter
          </h2>
          <p className="mt-4 text-sm leading-7 text-neutral-600">
            Pour toute question, demande de devis ou conseil personnalisé,
            contactez-nous par e-mail ou via le formulaire de contact.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="mailto:contact@tempel-outdoor.fr"
              className="inline-flex items-center rounded-full border border-black/10 bg-black/5 px-4 py-2 text-xs font-medium text-neutral-700 transition hover:bg-black hover:text-white"
            >
              contact@tempel-outdoor.fr
            </a>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center rounded-full border border-black/10 bg-black/5 px-4 py-2 text-xs font-medium text-neutral-700 transition hover:bg-black hover:text-white"
            >
              Formulaire de contact
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
