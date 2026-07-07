// src/app/[locale]/loisirs/[category]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    locale: string;
    category: string;
  }>;
};

export default async function LoisirsCategoryPage({ params }: Props) {
  const { locale, category } = await params;
  const supabase = await createClient();

  const { data: products, error } = await supabase
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
    .eq("universe", "loisirs")
    .eq("category", category)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    notFound();
  }

  const title = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-black">
      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/${locale}`}
            className="text-sm font-medium text-[#b87932] transition hover:text-black"
          >
            ← Retour à l’accueil
          </Link>

          <div className="mt-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#c76b2a]">
              Loisirs
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
              {title}
            </h1>

            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Découvrez notre sélection de produits pour transformer vos espaces
              extérieurs en véritables lieux de plaisir, de jeu et de partage.
            </p>
          </div>

          {products && products.length > 0 ? (
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => {
                const media = product.product_media?.sort(
                  (a, b) => (a.position ?? 0) - (b.position ?? 0)
                );

                const image = media?.find((item) => item.type !== "video");

                return (
                  <Link
                    key={product.id}
                    href={`/${locale}/products/${product.slug}`}
                    className="group overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                      {image?.url ? (
                        <Image
                          src={image.url}
                          alt={image.alt || product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                          Aucun visuel
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c76b2a]">
                        {product.category}
                      </p>

                      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                        {product.name}
                      </h2>

                      {product.short_description ? (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
                          {product.short_description}
                        </p>
                      ) : null}

                      <div className="mt-6 flex items-end justify-between gap-4">
                        <div>
                          {product.compare_at_price ? (
                            <p className="text-sm text-neutral-400 line-through">
                              {product.compare_at_price} €
                            </p>
                          ) : null}

                          <p className="text-2xl font-semibold">
                            {product.price} €
                          </p>
                        </div>

                        <span className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white">
                          Voir le produit
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-14 rounded-[2rem] border border-dashed border-black/20 bg-white p-10 text-center">
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