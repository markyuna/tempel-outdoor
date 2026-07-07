import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

const FEATURED_SLUGS = [
  "spa-joy",
  "barrel-sauna-panorama",
  "baby-foot-origin-duo-blanc",
  "table-de-billard-convertible-noir",
];

type ProductMedia = {
  id: string;
  url: string;
  alt: string | null;
  type: "image" | "video";
  is_featured: boolean | null;
  position: number | null;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  universe: string;
  category: string;
  product_media: ProductMedia[] | null;
};

function getCategoryLabel(product: Product) {
  if (product.universe === "bien-etre") return "Bien-être";
  if (product.universe === "loisirs") return "Loisirs";
  if (product.universe === "fitness") return "Fitness";

  return product.category;
}

function getProductImage(product: Product) {
  const media = [...(product.product_media ?? [])]
    .filter((item) => item.type === "image")
    .sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return (a.position ?? 0) - (b.position ?? 0);
    });

  return media[0]?.url ?? "/images/placeholder-product.jpg";
}

export default async function ProduitsPhares({ locale = "fr" }: { locale?: string }) {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      universe,
      category,
      product_media (
        id,
        url,
        alt,
        type,
        is_featured,
        position
      )
    `
    )
    .in("slug", FEATURED_SLUGS)
    .eq("status", "active");

  if (error) {
    console.error("Erreur ProduitsPhares:", error);
  }

  const sortedProducts = FEATURED_SLUGS.map((slug) =>
    products?.find((product) => product.slug === slug)
  ).filter(Boolean) as Product[];

  if (sortedProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f7f4ef] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <span className="mb-4 block text-sm font-medium uppercase tracking-[0.35em] text-[#b67c2d]">
              Produits phares
            </span>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-black md:text-5xl">
              Nos meilleures sélections
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-relaxed text-neutral-600">
            Découvrez une sélection de produits emblématiques choisis pour leur
            qualité, leur design et leur capacité à transformer votre espace
            extérieur.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {sortedProducts.map((product) => {
            const image = getProductImage(product);

            return (
              <Link
                key={product.id}
                href={`/${locale}/products/${product.slug}`}
                className="group block overflow-hidden rounded-[32px] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-[280px] overflow-hidden">
                  <Image
                    src={image}
                    alt={product.product_media?.[0]?.alt ?? product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <div className="p-6">
                  <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#b67c2d]">
                    {getCategoryLabel(product)}
                  </span>

                  <h3 className="mt-3 text-2xl font-semibold text-black">
                    {product.name}
                  </h3>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black transition-all duration-300 group-hover:gap-4">
                    Découvrir
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}