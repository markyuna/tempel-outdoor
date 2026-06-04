// src/app/[locale]/loisirs/billard/page.tsx

import CategoryProductsPage from "@/components/products/CategoryProductsPage";

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