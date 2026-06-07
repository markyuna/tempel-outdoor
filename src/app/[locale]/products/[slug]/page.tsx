// src/app/[locale]/products/[slug]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import ProductBuyBox from "@/components/products/ProductBuyBox";
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

type ProductOption = {
  id: string;
  name: string;
  values: string[];
  required: boolean;
  position: number;
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
  product_options: ProductOption[] | null;
  product_spec_sections: ProductSpecSection[] | null;
};

const CATEGORY_VIDEOS: Record<string, string> = {
  spa: "/videos/spa.mp4",
  sauna: "/videos/sauna.mp4",
  billard: "/videos/billard-tempel.mp4",
  "baby-foot": "/videos/fabrication.mp4",
  fitness: "/videos/fitness.mp4",
};

const CATEGORY_LABELS: Record<string, string> = {
  spa: "Spa",
  sauna: "Sauna",
  "baby-foot": "Baby-foot",
  billard: "Billard",
  fitness: "Fitness",
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
      product_options (
        id,
        name,
        values,
        required,
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

  if (error || !data) {
    return null;
  }

  return data as Product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Produit introuvable | Tempel Outdoor",
      description: "Ce produit n'est pas disponible.",
    };
  }

  return {
    title: `${product.name} | Tempel Outdoor`,
    description: product.short_description || product.description || "",
  };
}

function getCategoryLabel(category: string) {
  return CATEGORY_LABELS[category] || category;
}

function sortMedia(media: ProductMedia[]) {
  return [...media].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;

    return (a.position ?? 999) - (b.position ?? 999);
  });
}

function sortVariants(variants: ProductVariant[]) {
  return [...variants].sort(
    (a, b) => (a.position ?? 999) - (b.position ?? 999)
  );
}

function sortOptions(options: ProductOption[]) {
  return [...options].sort((a, b) => a.position - b.position);
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const media = sortMedia(product.product_media ?? []);
  const variants = sortVariants(product.product_variants ?? []);
  const options = sortOptions(product.product_options ?? []);

  const storyVideoUrl =
    CATEGORY_VIDEOS[product.category] ?? "/videos/tempel-outdoor.mp4";

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

            <ProductBuyBox
              name={product.name}
              categoryLabel={getCategoryLabel(product.category)}
              price={Number(product.price)}
              compareAtPrice={product.compare_at_price}
              stock={product.stock}
              shortDescription={product.short_description}
              deliveryTime={product.delivery_time}
              options={options}
            />
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