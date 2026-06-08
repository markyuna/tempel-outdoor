// src/app/[locale]/checkout/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

type CartItem = {
  id: string;
  productId?: string;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
  quantity: number;
  options?: Record<string, string>;
};

type CustomerForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  message: string;
};

const CART_STORAGE_KEY = "tempel_cart";

function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(
      window.localStorage.getItem(CART_STORAGE_KEY) || "[]"
    ) as CartItem[];
  } catch {
    return [];
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CheckoutPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "fr";

  const [cart] = useState<CartItem[]>(getInitialCart);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [form, setForm] = useState<CustomerForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    message: "",
  });

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  function updateField(field: keyof CustomerForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitted(true);
    window.localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event("tempel-cart-updated"));
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-6 py-28 text-[#181512]">
        <section className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#9c7b4f]">
            Demande envoyée
          </p>

          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Merci pour votre commande
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-neutral-600">
            Votre demande a bien été préparée. Un conseiller Tempel Outdoor vous
            contactera rapidement pour confirmer la disponibilité, la livraison
            et les modalités de paiement.
          </p>

          <Link
            href={`/${locale}`}
            className="mt-8 inline-flex rounded-full bg-black px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#2b241f]"
          >
            Retour à l&apos;accueil
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-28 text-[#181512]">
      <section className="mx-auto max-w-7xl">
        <Link
          href={`/${locale}/cart`}
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au panier
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] bg-white p-7 shadow-sm md:p-10"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#9c7b4f]">
              Finaliser ma demande
            </p>

            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Informations de contact
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600">
              Renseignez vos coordonnées. Tempel Outdoor vous recontactera pour
              valider les détails de livraison, l’installation éventuelle et le
              paiement.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">Prénom *</label>
                <input
                  required
                  value={form.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Nom *</label>
                <input
                  required
                  value={form.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Téléphone *</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold">Adresse</label>
                <input
                  value={form.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Code postal</label>
                <input
                  value={form.postalCode}
                  onChange={(event) =>
                    updateField("postalCode", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Ville</label>
                <input
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold">
                  Message ou précision
                </label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  placeholder="Exemple : accès jardin, besoin d'installation, date souhaitée..."
                  className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cart.length === 0}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-black px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#2b241f] disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              Envoyer ma demande
            </button>
          </form>

          <aside className="h-fit rounded-[2rem] bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-semibold">Résumé du panier</h2>

            {cart.length === 0 ? (
              <div className="mt-8 rounded-3xl bg-[#f7f4ee] p-6 text-center">
                <ShoppingBag className="mx-auto h-8 w-8 text-neutral-400" />
                <p className="mt-4 text-sm text-neutral-600">
                  Votre panier est vide.
                </p>

                <Link
                  href={`/${locale}`}
                  className="mt-5 inline-flex rounded-full bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                >
                  Voir les produits
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-6 space-y-5">
                  {cart.map((item) => (
                    <article
                      key={item.id}
                      className="flex gap-4 border-b border-black/10 pb-5 last:border-b-0"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f7f4ee]">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-neutral-300" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-semibold">
                          {item.name}
                        </h3>

                        {item.options ? (
                          <div className="mt-2 space-y-1">
                            {Object.entries(item.options).map(
                              ([label, value]) => (
                                <p
                                  key={`${item.id}-${label}`}
                                  className="text-xs text-neutral-500"
                                >
                                  {label} : {value}
                                </p>
                              )
                            )}
                          </div>
                        ) : null}

                        <p className="mt-2 text-xs text-neutral-500">
                          Quantité : {item.quantity}
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-6 border-t border-black/10 pt-6">
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                <div className="mt-4 flex justify-between text-sm text-neutral-600">
                    <span>Livraison</span>
                    <span className="font-medium text-emerald-600">
                        Gratuite
                    </span>
                </div>

                <div className="mt-6 flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}