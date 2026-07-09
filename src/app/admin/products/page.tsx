import Link from "next/link";

import AdminProductsList from "@/components/admin/AdminProductsList";
import { getProducts } from "@/lib/products";

const CATEGORY_LABELS: Record<string, string> = {
  spa: "Spa",
  sauna: "Sauna",
  "baby-foot": "Baby-foot",
  billard: "Billard",
  fitness: "Fitness",
};

const CATEGORY_ORDER = ["spa", "sauna", "billard", "baby-foot", "fitness"];

function getCategoryLabel(category: string) {
  return CATEGORY_LABELS[category] || category || "Sans catégorie";
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  const categories = Array.from(
    new Set(products.map((product) => product.category || "sans-categorie"))
  ).sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  const groups = categories.map((category) => ({
    category,
    label: getCategoryLabel(category),
    products: products.filter(
      (product) => (product.category || "sans-categorie") === category
    ),
  }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-[#181512]">Produits</h1>
          <p className="mt-2 text-sm text-black/55">
            {products.length} produit{products.length !== 1 ? "s" : ""} dans le catalogue
          </p>
        </div>

        <Link
          href="/admin/products/create"
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Nouveau produit
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-black/10 bg-white p-10 text-center text-sm text-black/50 shadow-sm">
          Aucun produit pour le moment.
        </div>
      ) : (
        <AdminProductsList groups={groups} />
      )}
    </main>
  );
}
