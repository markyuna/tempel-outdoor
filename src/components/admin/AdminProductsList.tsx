"use client";

import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

import DeleteProductButton from "@/components/admin/DeleteProductButton";
import type { Product } from "@/types/product";

type ProductGroup = {
  category: string;
  label: string;
  products: Product[];
};

type Props = {
  groups: ProductGroup[];
};

function ProductsTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-black/50">
        Aucun produit ne correspond à la recherche.
      </p>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-[#181512] text-white">
          <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Nom</th>
          <th className="p-4 text-left text-xs font-semibold uppercase tracking-[0.18em]">Univers</th>
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

            <td className="p-4 font-semibold text-[#181512]">
              {product.price.toLocaleString("fr-FR")} €
            </td>

            <td className="p-4 text-black/60">{product.stock}</td>

            <td className="p-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  product.status === "active"
                    ? "bg-emerald-100 text-emerald-800"
                    : product.status === "draft"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {product.status === "active"
                  ? "Actif"
                  : product.status === "draft"
                  ? "Brouillon"
                  : "Archivé"}
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
      </tbody>
    </table>
  );
}

function CategoryCard({
  label,
  products,
}: {
  label: string;
  products: Product[];
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setCollapsed((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-[#f7f4ee]"
      >
        <div>
          <h2 className="text-lg font-semibold text-[#181512]">{label}</h2>
          <p className="text-xs text-black/50">
            {products.length} produit{products.length !== 1 ? "s" : ""}
          </p>
        </div>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-black/50 transition-transform ${
            collapsed ? "" : "rotate-180"
          }`}
        />
      </button>

      {!collapsed && (
        <div className="overflow-x-auto border-t border-black/10">
          <ProductsTable products={products} />
        </div>
      )}
    </div>
  );
}

export default function AdminProductsList({ groups }: Props) {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) return groups;

    return groups
      .map((group) => ({
        ...group,
        products: group.products.filter((product) =>
          product.name.toLowerCase().includes(cleanQuery)
        ),
      }))
      .filter((group) => group.products.length > 0);
  }, [groups, query]);

  return (
    <div className="mt-10 grid gap-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher un produit par nom..."
          className="h-12 w-full rounded-full border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-black"
        />
      </div>

      {filteredGroups.length === 0 && (
        <p className="rounded-3xl border border-black/10 bg-white p-10 text-center text-sm text-black/50">
          Aucun produit ne correspond à la recherche.
        </p>
      )}

      {filteredGroups.map((group) => (
        <CategoryCard
          key={group.category}
          label={group.label}
          products={group.products}
        />
      ))}
    </div>
  );
}
