// src/app/[locale]/products/[slug]/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";

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

const SAUNA_ATELIER_IMAGE = "/images/atelier-sauna.webp";
const SPA_ATELIER_IMAGE = "/images/atelier-spa.webp";

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

async function getInitialIsFavorite(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return false;
  }

  const { data: favorite, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    console.error("Erreur récupération favori produit:", error);
    return false;
  }

  return Boolean(favorite);
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

function getFeaturedImage(media: ProductMedia[]) {
  return (
    media.find((item) => item.type === "image" && item.is_featured)?.url ??
    media.find((item) => item.type === "image")?.url ??
    null
  );
}

function getProductDescriptionParagraphs(description: string | null) {
  if (!description) {
    return [];
  }

  return description
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function ProductDescriptionSection({
  productName,
  description,
}: {
  productName: string;
  description: string | null;
}) {
  const paragraphs = getProductDescriptionParagraphs(description);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <section className="relative mt-16 overflow-hidden rounded-[2.25rem] border border-black/10 bg-white p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)] md:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#d7b86e]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-[#c47a2c]/10 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d7b86e]/40 bg-[#fbf4e3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6a21]">
            <Sparkles className="h-3.5 w-3.5" />
            Description
          </span>

          <h2 className="mt-6 max-w-md text-3xl font-semibold tracking-tight text-[#181512] md:text-4xl">
            {productName}, pensé pour votre confort.
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-neutral-500">
            Une présentation claire du produit, de son usage et de ses avantages
            pour vous aider à choisir le modèle le plus adapté à votre espace.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-black/10 bg-[#f7f4ee] p-6 md:p-8">
          <div className="space-y-5 text-base leading-8 text-neutral-700">
            {paragraphs.map((paragraph, index) => (
              <p key={`${productName}-description-${index}`}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              "Confort au quotidien",
              "Design extérieur",
              "Sélection premium",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#181512]"
              >
                <CheckCircle2 className="h-4 w-4 text-[#c47a2c]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductAtelierCard({
  image,
  alt,
  title,
  description,
  tags,
  badge,
}: {
  image: string;
  alt: string;
  title: string;
  description: string;
  tags: string[];
  badge: string;
}) {
  return (
    <article className="grid min-h-[420px] overflow-hidden rounded-[2rem] border border-black/10 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:grid-cols-2">
      <div className="flex flex-col justify-between p-8 text-white md:p-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.45em] text-[#d6bd7f]">
            Tempel Outdoor
          </span>

          <h2 className="mt-8 max-w-sm text-4xl font-semibold leading-tight md:text-5xl">
            {title}
          </h2>

          <p className="mt-7 max-w-sm text-base leading-8 text-white/75">
            {description}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {tags.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="relative min-h-[320px] md:min-h-full">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 30vw, 100vw"
          className="object-cover"
          priority={false}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
          {badge}
        </div>
      </div>
    </article>
  );
}

function ProductSaunaAtelierImage() {
  return (
    <ProductAtelierCard
      image={SAUNA_ATELIER_IMAGE}
      alt="Atelier de fabrication de sauna en bois Tempel Outdoor"
      title="L'excellence du savoir-faire bois."
      description="Nos saunas sont pensés pour offrir une expérience extérieure haut de gamme, avec une attention particulière portée au bois, aux finitions et au confort."
      tags={["Atelier bois", "Finitions premium", "Sauna extérieur"]}
      badge="Savoir-faire sauna"
    />
  );
}

function ProductSpaAtelierImage() {
  return (
    <ProductAtelierCard
      image={SPA_ATELIER_IMAGE}
      alt="Atelier de préparation d’un spa Tempel Outdoor"
      title="Le soin du détail, jusque dans chaque jet."
      description="Chaque spa est préparé avec précision pour offrir une expérience de relaxation haut de gamme, entre confort, performance et finitions premium."
      tags={["Atelier spa", "Jets hydromassage", "Finitions premium"]}
      badge="Savoir-faire spa"
    />
  );
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
  const featuredImage = getFeaturedImage(media);
  const initialIsFavorite = await getInitialIsFavorite(product.id);

  const isSpa = product.category === "spa";
  const isSauna = product.category === "sauna";

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
              id={product.id}
              name={product.name}
              slug={product.slug}
              image={featuredImage}
              categoryLabel={getCategoryLabel(product.category)}
              price={Number(product.price)}
              compareAtPrice={product.compare_at_price}
              stock={product.stock}
              shortDescription={product.short_description}
              deliveryTime={product.delivery_time}
              options={options}
              initialIsFavorite={initialIsFavorite}
              locale={locale}
            />
          </div>

          <ProductDescriptionSection
            productName={product.name}
            description={product.description}
          />

          <section className="mt-20 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            {isSauna ? (
              <ProductSaunaAtelierImage />
            ) : isSpa ? (
              <ProductSpaAtelierImage />
            ) : (
              <ProductStoryVideo
                videoUrl={storyVideoUrl}
                title="L'excellence du savoir-faire français."
                description="Chaque produit est sélectionné pour offrir une expérience extérieure haut de gamme, alliant design, robustesse et confort."
              />
            )}

            <ProductSpecs sections={product.product_spec_sections} />
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Livraison France",
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