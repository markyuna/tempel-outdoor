import Link from "next/link";

import { getProducts } from "@/lib/products";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold">
          Produits
        </h1>

        <Link
          href="/admin/produits/nouveau"
          className="rounded-full bg-black px-6 py-3 text-white"
        >
          Nouveau produit
        </Link>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Nom</th>
              <th className="p-4 text-left">Catégorie</th>
              <th className="p-4 text-left">Prix</th>
              <th className="p-4 text-left">Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-4">
                  {product.name}
                </td>

                <td className="p-4">
                  {product.category}
                </td>

                <td className="p-4">
                  {product.price} €
                </td>

                <td className="p-4">
                  {product.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}