// src/app/[locale]/bien-etre/sauna/page.tsx

import type { Metadata } from "next";

import CategoryProductsPage from "@/components/products/CategoryProductsPage";
import { buildAlternates, buildOg } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = "Sauna bois extérieur haut de gamme — Tempel Outdoor";
  const description =
    "Saunas extérieurs en épicéa et thermo-bois, de 2 à 10 places. Chauffage électrique ou bois, finitions premium pour un bien-être toute l'année.";

  return {
    title,
    description,
    alternates: buildAlternates(locale, "/bien-etre/sauna"),
    openGraph: buildOg({ title, description, locale }),
  };
}

export default function SaunaPage() {
  return (
    <CategoryProductsPage
      universe="bien-etre"
      category="sauna"
      title="Sauna bois"
      eyebrow="Bien-être"
      description="Découvrez nos saunas en bois, conçus pour transformer votre extérieur en véritable espace de relaxation premium."
    />
  );
}
