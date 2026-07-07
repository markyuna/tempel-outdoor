import Link from "next/link";

import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { getProducts } from "@/lib/products";

export default async function AdminProductsPage() {
  const products = await getProducts();

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

      <div className="mt-10 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-[#181512] text-white">
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Nom</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Univers</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Catégorie</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Prix</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Stock</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Statut</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-black/10 transition hover:bg-[#f7f4ee]"
              >
                <td className="p-4 font-medium text-[#181512]">{product.name}</td>

                <td className="p-4 capitalize text-black/60">
                  {product.universe || "—"}
                </td>

                <td className="p-4 capitalize text-black/60">
                  {product.category || "—"}
                </td>

                <td className="p-4 font-semibold text-[#181512]">
                  {product.price.toLocaleString("fr-FR")} €
                </td>

                <td className="p-4 text-black/60">{product.stock}</td>

                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    product.status === "active"
                      ? "bg-emerald-100 text-emerald-800"
                      : product.status === "draft"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-neutral-100 text-neutral-600"
                  }`}>
                    {product.status === "active" ? "Actif" : product.status === "draft" ? "Brouillon" : "Archivé"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                    >
                      Modifier
                    </Link>

                    <Link
                      href={`/fr/products/${product.slug}`}
                      target="_blank"
                      className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold transition hover:bg-black/5"
                    >
                      Voir
                    </Link>

                    <DeleteProductButton
                      productId={product.id}
                      productName={product.name}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-10 text-center text-sm text-black/50"
                >
                  Aucun produit pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
