// src/app/[locale]/bien-etre/spa/page.tsx

import type { Metadata } from "next";

import CategoryProductsPage from "@/components/products/CategoryProductsPage";
import { buildAlternates, buildOg } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = "Spa extérieur haut de gamme — Collection Tempel Outdoor";
  const description =
    "Découvrez notre sélection de spas extérieurs de 2 à 7 places : hydromassage, design premium et confort exceptionnel pour votre jardin ou terrasse.";

  return {
    title,
    description,
    alternates: buildAlternates(locale, "/bien-etre/spa"),
    openGraph: buildOg({ title, description, locale }),
  };
}

export default function SpaPage() {
  return (
    <CategoryProductsPage
      universe="bien-etre"
      category="spa"
      title="Spa extérieur"
      eyebrow="Bien-être"
      description="Découvrez notre sélection de spas extérieurs pour créer un espace de détente élégant, confortable et durable."
    />
  );
}
