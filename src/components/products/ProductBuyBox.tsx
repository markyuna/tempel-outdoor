// src/components/products/ProductBuyBox.tsx

"use client";

import {
  BadgeCheck,
  Heart,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

type ProductOption = {
  id: string;
  name: string;
  values: string[];
  required: boolean;
  position: number;
};

type CartItem = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
  quantity: number;
  options?: Record<string, string>;
};

type Props = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  categoryLabel: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  shortDescription: string | null;
  deliveryTime: string | null;
  options: ProductOption[];
  initialIsFavorite?: boolean;
  locale?: string;
};

import { CART_STORAGE_KEY, CART_UPDATED_EVENT } from "@/lib/cart";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function parseOptionValue(value: string) {
  const [label, priceValue] = value.split("|").map((item) => item.trim());
  const price = priceValue ? Number(priceValue.replace(",", ".")) : null;

  return {
    label: label || value,
    price: Number.isFinite(price) ? price : null,
  };
}

export default function ProductBuyBox({
  id,
  name,
  slug,
  image,
  categoryLabel,
  price,
  compareAtPrice,
  stock,
  shortDescription,
  deliveryTime,
  options,
  initialIsFavorite = false,
  locale = "fr",
}: Props) {
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [isFavoritePending, startFavoriteTransition] = useTransition();

  const sortedOptions = useMemo(
    () => [...options].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [options]
  );

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    return sortedOptions.reduce<Record<string, string>>((acc, option) => {
      if (option.values[0]) acc[option.id] = option.values[0];
      return acc;
    }, {});
  });

  const selectedPrice = useMemo(() => {
    for (const selectedValue of Object.values(selectedOptions)) {
      const parsed = parseOptionValue(selectedValue);
      if (parsed.price) return parsed.price;
    }

    return price;
  }, [price, selectedOptions]);

  const selectedOptionLabels = useMemo(() => {
    return sortedOptions.reduce<Record<string, string>>((acc, option) => {
      const selectedValue = selectedOptions[option.id];

      if (!selectedValue) return acc;

      acc[option.name] = parseOptionValue(selectedValue).label;
      return acc;
    }, {});
  }, [selectedOptions, sortedOptions]);

  const hasDiscount = compareAtPrice && compareAtPrice > selectedPrice;

  function handleAddToCart() {
    if (stock <= 0 || typeof window === "undefined") return;

    const cartItemId = `${id}-${JSON.stringify(selectedOptionLabels)}`;

    const currentCart = JSON.parse(
      window.localStorage.getItem(CART_STORAGE_KEY) || "[]"
    ) as CartItem[];

    const existingItem = currentCart.find((item) => item.id === cartItemId);

    const updatedCart = existingItem
      ? currentCart.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [
          ...currentCart,
          {
            id: cartItemId,
            productId: id,
            name,
            slug,
            price: selectedPrice,
            image: image ?? null,
            quantity: 1,
            options: selectedOptionLabels,
          },
        ];

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  function handleToggleFavorite() {
    setFavoriteError(null);

    startFavoriteTransition(async () => {
      const nextIsFavorite = !isFavorite;

      setIsFavorite(nextIsFavorite);

      try {
        const response = await fetch("/api/favorites", {
          method: nextIsFavorite ? "POST" : "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: id,
          }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          setIsFavorite(!nextIsFavorite);

          if (response.status === 401) {
            window.location.href = `/${locale}/auth/login`;
            return;
          }

          setFavoriteError(
            result?.error ||
              "Impossible de mettre à jour ce produit dans vos favoris."
          );

          return;
        }

        setIsFavorite(Boolean(result?.isFavorite));
      } catch (error) {
        console.error("Erreur favori:", error);

        setIsFavorite(!nextIsFavorite);
        setFavoriteError(
          "Une erreur est survenue. Veuillez réessayer dans quelques instants."
        );
      }
    });
  }

  return (
    <>
      <aside className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#d7b86e] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
            {categoryLabel}
          </span>

          <span
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              stock > 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {stock > 0 ? "En stock" : "Rupture"}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {name}
        </h1>

        {shortDescription ? (
          <p className="mt-4 text-base leading-7 text-neutral-600">
            {shortDescription}
          </p>
        ) : null}

        <div className="mt-8 flex items-end gap-4">
          <p className="text-3xl font-bold">{formatPrice(selectedPrice)}</p>

          {hasDiscount ? (
            <p className="pb-1 text-lg text-neutral-400 line-through">
              {formatPrice(Number(compareAtPrice))}
            </p>
          ) : null}
        </div>

        {sortedOptions.length > 0 ? (
          <div className="mt-8 space-y-6">
            {sortedOptions.map((option) => (
              <div key={option.id}>
                <div className="mb-3 flex items-center gap-3">
                  <p className="text-sm font-semibold">{option.name}</p>

                  {option.required ? (
                    <span className="rounded-full bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                      Obligatoire
                    </span>
                  ) : null}
                </div>

                <div className="grid gap-3">
                  {option.values.map((value) => {
                    const parsed = parseOptionValue(value);
                    const isSelected = selectedOptions[option.id] === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setSelectedOptions((current) => ({
                            ...current,
                            [option.id]: value,
                          }))
                        }
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-black/10 bg-[#f7f4ee] text-black hover:border-black/30"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {parsed.label}
                        </span>

                        {parsed.price ? (
                          <span className="text-sm font-bold">
                            {formatPrice(parsed.price)}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-8 grid gap-3 text-sm text-neutral-700">
          <div className="flex items-center gap-3">
            <PackageCheck className="h-5 w-5 text-[#c76b2a]" />
            Stock disponible :
            <span className="font-semibold text-black">{stock}</span>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-[#c76b2a]" />
            Livraison :
            <span className="font-semibold text-black">
              {deliveryTime || "Sur devis"}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#2b241f] disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            <ShoppingBag className="h-5 w-5" />
            {added ? "Ajouté au panier" : "Ajouter au panier"}
          </button>

          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={isFavoritePending}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
            }
            title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            className={`inline-flex h-14 w-14 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isFavorite
                ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                : "border-black/10 text-black hover:bg-[#f7f4ee]"
            }`}
          >
            <Heart
              className={`h-5 w-5 transition ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>
        </div>

        {favoriteError ? (
          <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {favoriteError}
          </p>
        ) : null}

        <div className="mt-8 grid gap-4 border-t border-black/10 pt-7">
          <div className="flex gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-[#c76b2a]" />
            <div>
              <p className="font-semibold">Paiement sécurisé</p>
              <p className="text-sm text-neutral-600">
                Commande protégée et expérience d’achat fiable.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <BadgeCheck className="mt-1 h-5 w-5 text-[#c76b2a]" />
            <div>
              <p className="font-semibold">Sélection premium</p>
              <p className="text-sm text-neutral-600">
                Produits choisis pour le confort, le design et la durée.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {added ? (
        <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white shadow-2xl">
          <ShoppingBag className="h-5 w-5 text-[#d7b86e]" />
          Produit ajouté au panier
        </div>
      ) : null}
    </>
  );
}