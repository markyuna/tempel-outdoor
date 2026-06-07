// src/app/[locale]/realisations/page.tsx

import Image from "next/image";
import Link from "next/link";

import BeforeAfterSlider from "@/components/realisations/BeforeAfterSlider";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

type MediaRole = "before" | "after";

type RealisationMedia = {
  id: string;
  url: string;
  alt: string | null;
  type: string | null;
  role: MediaRole | null;
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

function getSortedImages(media: RealisationMedia[] | null) {
  return [...(media ?? [])]
    .filter((item) => item.type === "image" || item.type === null)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

function getCoverImage(media: RealisationMedia[] | null) {
  const images = getSortedImages(media);

  if (images.length === 0) return null;

  return (
    images.find((item) => item.role === "after") ??
    images.find((item) => item.is_cover) ??
    images[0]
  );
}

function getBeforeAfterImages(media: RealisationMedia[] | null) {
  const images = getSortedImages(media);

  const before = images.find((item) => item.role === "before") ?? null;

  const after =
    images.find((item) => item.role === "after") ??
    images.find((item) => item.is_cover) ??
    images[0] ??
    null;

  return { before, after };
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
        role,
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
        </div>
      </section>

      {(realisations ?? []).length > 0 ? (
        <section>
          {(realisations ?? []).map((realisation, index) => {
            const cover = getCoverImage(realisation.realisation_media);
            const { before, after } = getBeforeAfterImages(
              realisation.realisation_media
            );

            const isReversed = index % 2 !== 0;
            const sectionBg = index % 2 === 0 ? "bg-[#f7f4ee]" : "bg-[#eee6d8]";

            return (
              <article key={realisation.id} className={sectionBg}>
                <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
                  <div
                    className={`grid items-center gap-12 lg:grid-cols-2 ${
                      isReversed ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div>
                      {before && after ? (
                        <BeforeAfterSlider
                          before={{
                            url: before.url,
                            alt: before.alt,
                          }}
                          after={{
                            url: after.url,
                            alt: after.alt,
                          }}
                          title={realisation.title}
                        />
                      ) : cover ? (
                        <div className="group relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-black/5 shadow-sm">
                          <Image
                            src={cover.url}
                            alt={cover.alt || realisation.title}
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />

                          <div className="absolute left-6 top-6 rounded-full bg-white/90 px-5 py-2 text-xs font-medium uppercase tracking-[0.22em] text-black shadow-sm">
                            {getCategoryLabel(realisation.category)}
                          </div>
                        </div>
                      ) : (
                        <div className="flex aspect-[4/3] items-center justify-center rounded-[2.5rem] bg-black/5 text-sm text-black/35">
                          Image à venir
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center px-2 py-8 md:px-10 lg:px-14">
                      <p className="text-sm uppercase tracking-[0.35em] text-[#b8872f]">
                        Réalisation {String(index + 1).padStart(2, "0")}
                      </p>

                      <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl xl:text-6xl">
                        {realisation.title}
                      </h2>

                      <div className="mt-6 flex flex-wrap gap-3 text-sm text-black/50">
                        <span>{realisation.city || "France"}</span>
                        <span>•</span>
                        <span>Projet livré</span>
                      </div>

                      {realisation.description && (
                        <p className="mt-8 max-w-xl text-lg leading-9 text-black/65">
                          {realisation.description}
                        </p>
                      )}

                      {realisation.client_quote && (
                        <blockquote className="mt-10 border-l-2 border-[#b8872f] pl-5 text-base italic leading-8 text-black/55">
                          “{realisation.client_quote}”
                        </blockquote>
                      )}

                      <div className="mt-10 h-px w-24 bg-gradient-to-r from-[#b8872f] to-transparent" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[2rem] border border-dashed border-black/15 bg-white/60 p-12 text-center">
              <h2 className="text-2xl font-semibold">
                Aucune réalisation disponible
              </h2>

              <p className="mt-3 text-black/55">
                Les premières installations clients seront bientôt ajoutées.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}