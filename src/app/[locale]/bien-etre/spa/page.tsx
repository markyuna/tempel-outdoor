// src/app/[locale]/bien-etre/spa/page.tsx

import CategoryProductsPage from "@/components/products/CategoryProductsPage";

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