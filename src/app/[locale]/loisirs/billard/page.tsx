// src/app/[locale]/loisirs/billard/page.tsx

import type { Metadata } from "next";

import CategoryProductsPage from "@/components/products/CategoryProductsPage";
import { buildAlternates, buildOg } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = "Billard convertible extérieur — Tempel Outdoor";
  const description =
    "Billards convertibles de 6 à 10 couverts, alliant jeu et table à manger. Design premium pour terrasse et espaces extérieurs.";

  return {
    title,
    description,
    alternates: buildAlternates(locale, "/loisirs/billard"),
    openGraph: buildOg({ title, description, locale }),
  };
}

export default function BillardPage() {
  return (
    <CategoryProductsPage
      universe="loisirs"
      category="billard"
      title="Billard convertible"
      eyebrow="Loisirs"
      description="Découvrez nos billards convertibles, pensés pour associer plaisir de jeu, design premium et usage quotidien."
    />
  );
}
