import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

type ProductImage = {
  id: string;
  url: string | null;
  image_url: string | null;
  alt: string | null;
  is_featured: boolean | null;
  position: number | null;
};

async function getProduct(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (
        id,
        url,
        image_url,
        alt,
        is_featured,
        position
      )
    `
    )
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Produit introuvable",
    };
  }

  return {
    title: `${product.name} | Tempel Outdoor`,
    description:
      product.short_description || product.description || product.name,
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

  if (!product) {
    notFound();
  }

  const images = ((product.product_images || []) as ProductImage[]).sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );

  const featuredImage =
    images.find((image) => image.is_featured)?.image_url ||
    images.find((image) => image.is_featured)?.url ||
    images[0]?.image_url ||
    images[0]?.url ||
    null;

  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-2">
            <div>
              <div className="overflow-hidden rounded-[2rem] border border-[#e5ddd0] bg-white">
                <div className="relative aspect-square bg-[#e8e0d4]">
                  {featuredImage ? (
                    <Image
                      src={featuredImage}
                      alt={images[0]?.alt || product.name}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="uppercase tracking-[0.3em] text-[#8a8178]">
                        Image produit
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {images.length > 1 ? (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.slice(0, 4).map((image) => {
                    const imageUrl = image.image_url || image.url;

                    if (!imageUrl) return null;

                    return (
                      <div
                        key={image.id}
                        className="relative aspect-square overflow-hidden rounded-2xl border border-[#e5ddd0] bg-white"
                      >
                        <Image
                          src={imageUrl}
                          alt={image.alt || product.name}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      </div>
                    );
                  })}
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
                {formatPrice(product.price)}
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
              {product.description}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}