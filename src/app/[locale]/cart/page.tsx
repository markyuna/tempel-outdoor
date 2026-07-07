// src/app/[locale]/cart/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
  quantity: number;
};

import { CART_STORAGE_KEY, CART_UPDATED_EVENT } from "@/lib/cart";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function readCartFromStorage(): CartItem[] {
  try {
    return JSON.parse(
      window.localStorage.getItem(CART_STORAGE_KEY) || "[]"
    ) as CartItem[];
  } catch {
    return [];
  }
}

export default function CartPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "fr";

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cart lives in localStorage, which isn't available during SSR — load it
  // after mount instead of in the initial state to avoid a hydration mismatch.
  useEffect(() => {
    function loadCart() {
      setCart(readCartFromStorage());
      setIsLoaded(true);
    }

    loadCart();
  }, []);

  function updateCart(nextCart: CartItem[]) {
    setCart(nextCart);
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }

  function increaseQuantity(productId: string) {
    updateCart(
      cart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(productId: string) {
    updateCart(
      cart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }

  function removeItem(productId: string) {
    updateCart(cart.filter((item) => item.id !== productId));
  }

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-28">
      <section className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#9c7b4f]">
            Votre sélection
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-[#1f1f1f] md:text-6xl">
            Panier
          </h1>
        </div>

        {!isLoaded ? null : cart.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f4ee]">
              <ShoppingBag className="h-7 w-7 text-[#9c7b4f]" />
            </div>

            <h2 className="text-2xl font-semibold text-[#1f1f1f]">
              Votre panier est vide
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
              Découvrez notre sélection premium de spas, saunas, billards,
              baby-foot et équipements outdoor.
            </p>

            <Link
              href={`/${locale}`}
              className="mt-8 inline-flex rounded-full bg-[#1f1f1f] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black"
            >
              Continuer mes achats
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-5 rounded-[2rem] bg-white p-5 shadow-sm md:grid-cols-[140px_1fr_auto]"
                >
                  <Link
                    href={`/${locale}/products/${item.slug}`}
                    className="relative aspect-square overflow-hidden rounded-3xl bg-[#f7f4ee]"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="140px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-neutral-300" />
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-col justify-center">
                    <Link
                      href={`/${locale}/products/${item.slug}`}
                      className="text-xl font-semibold text-[#1f1f1f] transition hover:text-[#9c7b4f]"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-2 text-sm text-neutral-500">
                      Prix unitaire : {formatPrice(item.price)}
                    </p>

                    <div className="mt-5 flex w-fit items-center rounded-full border border-neutral-200">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        className="flex h-10 w-10 items-center justify-center transition hover:text-[#9c7b4f]"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="min-w-10 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        className="flex h-10 w-10 items-center justify-center transition hover:text-[#9c7b4f]"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 md:flex-col md:items-end">
                    <p className="text-lg font-semibold text-[#1f1f1f]">
                      {formatPrice(item.price * item.quantity)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-[2rem] bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#1f1f1f]">
                Résumé
              </h2>

              <div className="mt-6 space-y-4 border-b border-neutral-200 pb-6">
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Livraison</span>
                  <span>Sur devis</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between text-lg font-semibold text-[#1f1f1f]">
                <span>Total estimé</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <Link
                href={`/${locale}/checkout`}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#1f1f1f] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black"
              >
                Passer commande
              </Link>

              <Link
                href={`/${locale}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-neutral-200 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#1f1f1f] transition hover:bg-[#f7f4ee]"
              >
                Continuer mes achats
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}