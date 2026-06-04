// src/app/[locale]/bien-etre/sauna/page.tsx

import CategoryProductsPage from "@/components/products/CategoryProductsPage";

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