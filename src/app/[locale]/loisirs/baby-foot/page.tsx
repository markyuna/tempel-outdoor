// src/app/[locale]/loisirs/baby-foot/page.tsx

import type { Metadata } from "next";

import CategoryProductsPage from "@/components/products/CategoryProductsPage";
import { buildAlternates, buildOg } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = "Baby-foot extérieur premium — Tempel Outdoor";
  const description =
    "Baby-foot d'extérieur résistants aux intempéries, en version duo ou familiale. Design premium pour terrasse, jardin ou espace loisirs.";

  return {
    title,
    description,
    alternates: buildAlternates(locale, "/loisirs/baby-foot"),
    openGraph: buildOg({ title, description, locale }),
  };
}

export default function BabyFootPage() {
  return (
    <CategoryProductsPage
      universe="loisirs"
      category="baby-foot"
      title="Baby-foot extérieur"
      eyebrow="Loisirs"
      description="Découvrez notre sélection de baby-foot extérieurs pensés pour créer un espace de jeu élégant, convivial et durable."
    />
  );
}
