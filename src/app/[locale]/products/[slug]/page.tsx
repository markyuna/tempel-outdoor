// src/app/[locale]/products/[slug]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Play, ShoppingBag } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

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
  price: number;
  stock: number;
  category: string;
  universe: string;
  short_description: string | null;
  description: string | null;
  product_media: ProductMedia[] | null;
};

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      stock,
      category,
      universe,
      short_description,
      description,
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
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error || !data) return null;

  return data as Product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  return {
    title: product ? `${product.name} | Tempel Outdoor` : "Produit introuvable",
    description: product?.short_description || product?.description || "",
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const media = [...(product.product_media ?? [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );

  const featuredMedia =
    media.find((item) => item.is_featured) ||
    media.find((item) => item.type === "image") ||
    media[0] ||
    null;

  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/${locale}/${product.universe}/${product.category}`}
            className="inline-flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux produits
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-2">
            <div>
              <div className="overflow-hidden rounded-[2rem] border border-[#e5ddd0] bg-white">
                <div className="aspect-square bg-[#e8e0d4]">
                  {featuredMedia ? (
                    featuredMedia.type === "video" ? (
                      <video
                        src={featuredMedia.url}
                        controls
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={featuredMedia.url}
                        alt={featuredMedia.alt || product.name}
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="uppercase tracking-[0.3em] text-[#8a8178]">
                        Aucun média
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {media.length > 1 ? (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {media.slice(0, 8).map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-[#e5ddd0] bg-white"
                    >
                      {item.type === "video" ? (
                        <>
                          <video
                            src={item.url}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.alt || product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <span className="inline-flex rounded-full bg-[#d7b86e] px-4 py-1 text-xs font-semibold">
                {product.category}
              </span>

              <h1 className="mt-5 text-4xl font-semibold md:text-5xl">
                {product.name}
              </h1>

              {product.short_description ? (
                <p className="mt-6 text-lg leading-8 text-[#5f5a54]">
                  {product.short_description}
                </p>
              ) : null}

              <div className="mt-8 text-4xl font-bold">
                {formatPrice(Number(product.price))}
              </div>

              <div className="mt-4">
                Stock disponible :{" "}
                <span className="font-semibold">{product.stock}</span>
              </div>

              <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-white transition hover:bg-[#2b241f]">
                <ShoppingBag className="h-5 w-5" />
                Ajouter au panier
              </button>
            </div>
          </div>

          <div className="mt-20 rounded-[2rem] border border-[#e5ddd0] bg-white p-10">
            <h2 className="text-2xl font-semibold">Description</h2>

            <div className="mt-6 whitespace-pre-line leading-8 text-[#5f5a54]">
              {product.description || "Aucune description disponible."}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}