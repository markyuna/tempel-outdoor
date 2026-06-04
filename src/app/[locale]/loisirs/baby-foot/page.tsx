// src/app/[locale]/loisirs/baby-foot/page.tsx

import CategoryProductsPage from "@/components/products/CategoryProductsPage";

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