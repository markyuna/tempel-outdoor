// src/components/products/CategoryProductsPage.tsx

import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

type ProductMedia = {
  id: string;
  url: string;
  alt: string | null;
  type: "image" | "video";
  position: number | null;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  short_description: string | null;
  category: string;
  universe: string;
  status: string;
  product_media: ProductMedia[] | null;
};

type Props = {
  universe: string;
  category: string;
  title: string;
  eyebrow: string;
  description: string;
  locale?: string;
};

const categoryVideos: Record<string, string> = {
  billard: "/videos/billard-tempel.mp4",
  "baby-foot": "/videos/baby-foot-tempel.mp4",
  spa: "/videos/spa-tempel.mp4",
  sauna: "/videos/sauna-tempel.mp4",
  fitness: "/videos/fitness-tempel.mp4",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function CategoryProductsPage({
  universe,
  category,
  title,
  eyebrow,
  description,
  locale = "fr",
}: Props) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      compare_at_price,
      short_description,
      category,
      universe,
      status,
      product_media (
        id,
        url,
        alt,
        type,
        position
      )
    `
    )
    .eq("universe", universe)
    .eq("category", category)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur chargement catégorie:", error.message);
  }

  const products = (data ?? []) as Product[];
  const videoSrc = categoryVideos[category];

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-black">
      <section className="relative min-h-screen overflow-hidden bg-black">
        {videoSrc ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : null}

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-[#f7f4ee]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-20 pt-15">
          <div className="max-w-4xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.45em] text-[#d7b86e]">
              {eyebrow}
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-6xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
              {description}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const media = [...(product.product_media ?? [])].sort(
                  (a, b) => (a.position ?? 0) - (b.position ?? 0)
                );

                const image = media.find((item) => item.type === "image");

                return (
                  <Link
                    key={product.id}
                    href={`/${locale}/products/${product.slug}`}
                    className="group overflow-hidden rounded-[2rem] border border-white/15 bg-white/95 shadow-2xl backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                      {image?.url ? (
                        <img
                          src={image.url}
                          alt={image.alt || product.name}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                          Aucun visuel
                        </div>
                      )}

                      <div className="absolute left-4 top-4 rounded-full bg-black/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                        {product.category}
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        {product.name}
                      </h2>

                      {product.short_description ? (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600">
                          {product.short_description}
                        </p>
                      ) : null}

                      <div className="mt-6 flex items-end justify-between gap-4">
                        <div>
                          {product.compare_at_price ? (
                            <p className="text-sm text-neutral-400 line-through">
                              {formatPrice(product.compare_at_price)}
                            </p>
                          ) : null}

                          <p className="text-2xl font-semibold">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        <span className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-[#c76b2a]">
                          Voir le produit
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-14 rounded-[2rem] border border-white/20 bg-white/90 p-10 text-center backdrop-blur">
              <h2 className="text-2xl font-semibold">
                Aucun produit disponible
              </h2>
              <p className="mt-3 text-neutral-600">
                Aucun produit actif n’est encore associé à cette catégorie.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}