import Link from "next/link";

import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { getProducts } from "@/lib/products";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold">Products</h1>

        <Link
          href="/admin/products/create"
          className="rounded-full bg-black px-6 py-3 text-white transition hover:opacity-90"
        >
          New product
        </Link>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-[#f7f4ee]">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Universe</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b transition hover:bg-gray-50"
              >
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">{product.universe || "-"}</td>
                <td className="p-4">{product.category || "-"}</td>
                <td className="p-4">{product.price} €</td>
                <td className="p-4">{product.stock}</td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/fr/produits/${product.slug}`}
                      target="_blank"
                      className="rounded-full border px-4 py-2 text-xs font-semibold transition hover:bg-gray-100"
                    >
                      View
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
                <td colSpan={6} className="p-10 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}