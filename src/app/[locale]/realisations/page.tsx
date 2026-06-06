import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

type RealisationMedia = {
  id: string;
  url: string;
  alt: string | null;
  type: string | null;
  is_cover: boolean | null;
  position: number | null;
};

type Realisation = {
  id: string;
  title: string;
  slug: string;
  category: string;
  city: string | null;
  description: string | null;
  client_quote: string | null;
  realisation_media: RealisationMedia[] | null;
};

function getCoverImage(media: RealisationMedia[] | null) {
  if (!media || media.length === 0) return null;

  return (
    media.find((item) => item.is_cover) ??
    [...media].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0]
  );
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    spa: "Spa",
    sauna: "Sauna",
    billard: "Billard",
    "baby-foot": "Baby-foot",
    fitness: "Fitness",
  };

  return labels[category] ?? category;
}

export default async function RealisationsPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: realisations, error } = await supabase
    .from("realisations")
    .select(
      `
      id,
      title,
      slug,
      category,
      city,
      description,
      client_quote,
      realisation_media (
        id,
        url,
        alt,
        type,
        is_cover,
        position
      )
    `
    )
    .eq("status", "active")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur chargement réalisations:", error);
  }

  return (
    <main className="bg-[#f7f4ee] text-black">
      <section className="px-6 py-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/${locale}`}
            className="text-sm font-medium text-[#b8872f] transition hover:text-black"
          >
            ← Retour à l&apos;accueil
          </Link>

          <div className="mt-12 max-w-4xl">
            <p className="text-sm uppercase tracking-[0.45em] text-[#b8872f]">
              Projets clients
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-tight md:text-7xl">
              Réalisations
            </h1>

            <p className="mt-8 max-w-3xl text-xl leading-9 text-black/65">
              Découvrez quelques installations Tempel Outdoor : espaces
              bien-être, loisirs premium et aménagements extérieurs conçus pour
              transformer chaque lieu en expérience.
            </p>
          </div>

          {(realisations ?? []).length > 0 ? (
            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {(realisations ?? []).map((realisation) => {
                const cover = getCoverImage(realisation.realisation_media);

                return (
                  <article
                    key={realisation.id}
                    className="group overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                      {cover ? (
                        <Image
                          src={cover.url}
                          alt={cover.alt || realisation.title}
                          fill
                          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-black/35">
                          Image à venir
                        </div>
                      )}

                      <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em]">
                        {getCategoryLabel(realisation.category)}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex items-center justify-between gap-4 text-sm text-black/45">
                        <span>{realisation.city || "France"}</span>
                        <span>Projet livré</span>
                      </div>

                      <h2 className="text-2xl font-semibold leading-tight">
                        {realisation.title}
                      </h2>

                      {realisation.description && (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-black/60">
                          {realisation.description}
                        </p>
                      )}

                      {realisation.client_quote && (
                        <blockquote className="mt-5 border-l-2 border-[#b8872f] pl-4 text-sm italic text-black/60">
                          “{realisation.client_quote}”
                        </blockquote>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-16 rounded-[2rem] border border-dashed border-black/15 bg-white/60 p-12 text-center">
              <h2 className="text-2xl font-semibold">
                Aucune réalisation disponible
              </h2>

              <p className="mt-3 text-black/55">
                Les premières installations clients seront bientôt ajoutées.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}