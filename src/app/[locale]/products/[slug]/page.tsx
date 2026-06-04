// src/app/[locale]/products/[slug]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import ProductPurchaseSection from "@/components/products/ProductPurchaseSection";
import ProductSpecs from "@/components/products/ProductSpecs";
import ProductStoryVideo from "@/components/products/ProductStoryVideo";
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

type ProductVariant = {
  id: string;
  name: string;
  value: string;
  image_media_id: string | null;
  position: number | null;
};

type ProductSpecItem = {
  id: string;
  label: string;
  value: string;
  position: number | null;
};

type ProductSpecSection = {
  id: string;
  title: string;
  position: number | null;
  product_spec_items: ProductSpecItem[] | null;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  category: string;
  universe: string;
  short_description: string | null;
  description: string | null;
  delivery_time: string | null;
  product_media: ProductMedia[] | null;
  product_variants: ProductVariant[] | null;
  product_spec_sections: ProductSpecSection[] | null;
};

const categoryVideos: Record<string, string> = {
  spa: "/videos/spa.mp4",
  sauna: "/videos/sauna.mp4",
  billard: "/videos/billard-tempel.mp4",
  "baby-foot": "/videos/fabrication.mp4",
  fitness: "/videos/fitness.mp4",
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
      compare_at_price,
      stock,
      category,
      universe,
      short_description,
      description,
      delivery_time,
      product_media (
        id,
        url,
        alt,
        type,
        is_featured,
        position
      ),
      product_variants (
        id,
        name,
        value,
        image_media_id,
        position
      ),
      product_spec_sections (
        id,
        title,
        position,
        product_spec_items (
          id,
          label,
          value,
          position
        )
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

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    spa: "Spa",
    sauna: "Sauna",
    "baby-foot": "Baby-foot",
    billard: "Billard",
    fitness: "Fitness",
  };

  return labels[category] || category;
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const media = product.product_media ?? [];
  const variants = product.product_variants ?? [];

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;

  const storyVideoUrl =
    categoryVideos[product.category] ?? "/videos/tempel-outdoor.mp4";

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 pb-20 pt-4">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/${locale}/${product.universe}/${product.category}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux produits
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <ProductPurchaseSection
              media={media}
              variants={variants}
              productName={product.name}
            />

            <aside className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#d7b86e] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
                  {getCategoryLabel(product.category)}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    product.stock > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {product.stock > 0 ? "En stock" : "Rupture"}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                {product.name}
              </h1>

              {product.short_description ? (
                <p className="mt-4 text-base leading-7 text-neutral-600">
                  {product.short_description}
                </p>
              ) : null}

              <div className="mt-8 flex items-end gap-4">
                <p className="text-3xl font-bold">
                  {formatPrice(Number(product.price))}
                </p>

                {hasDiscount ? (
                  <p className="pb-1 text-lg text-neutral-400 line-through">
                    {formatPrice(Number(product.compare_at_price))}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 grid gap-3 text-sm text-neutral-700">
                <div className="flex items-center gap-3">
                  <PackageCheck className="h-5 w-5 text-[#c76b2a]" />
                  Stock disponible :{" "}
                  <span className="font-semibold text-black">
                    {product.stock}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-[#c76b2a]" />
                  Livraison :{" "}
                  <span className="font-semibold text-black">
                    {product.delivery_time || "Sur devis"}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
                <button
                  disabled={product.stock <= 0}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#2b241f] disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Ajouter au panier
                </button>

                <button className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-black/10 transition hover:bg-[#f7f4ee]">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 grid gap-4 border-t border-black/10 pt-7">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-[#c76b2a]" />
                  <div>
                    <p className="font-semibold">Paiement sécurisé</p>
                    <p className="text-sm text-neutral-600">
                      Commande protégée et expérience d’achat fiable.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <BadgeCheck className="mt-1 h-5 w-5 text-[#c76b2a]" />
                  <div>
                    <p className="font-semibold">Sélection premium</p>
                    <p className="text-sm text-neutral-600">
                      Produits choisis pour le confort, le design et la durée.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <section className="mt-20 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <ProductStoryVideo
              videoUrl={storyVideoUrl}
              title="L'excellence du savoir-faire français."
              description="Chaque produit est sélectionné pour offrir une expérience extérieure haut de gamme, alliant design, robustesse et confort."
            />

            <ProductSpecs sections={product.product_spec_sections} />
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Livraison France & Europe",
                text: "Accompagnement selon le produit, le volume et votre adresse.",
              },
              {
                title: "Conseil avant achat",
                text: "Nous vous aidons à choisir le bon modèle selon votre espace.",
              },
              {
                title: "Design extérieur premium",
                text: "Une sélection pensée pour valoriser votre maison et votre jardin.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-black/10 bg-white p-6"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {item.text}
                </p>
              </div>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}