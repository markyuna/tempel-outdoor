// src/app/[locale]/checkout/page.tsx

"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShoppingBag, UserCheck } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

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
  country: string;
  message: string;
};

type Profile = {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
};

type UserAddress = {
  first_name: string | null;
  last_name: string | null;
  address_line_1: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
};

type OrderResponse = {
  success?: boolean;
  orderId?: string;
  error?: string;
};

const CART_STORAGE_KEY = "tempel_cart";

function subscribeToCart(callback: () => void) {
  window.addEventListener("tempel-cart-updated", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("tempel-cart-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

function getCartSnapshot() {
  return window.localStorage.getItem(CART_STORAGE_KEY) || "[]";
}

function getServerCartSnapshot() {
  return "[]";
}

function parseCart(snapshot: string): CartItem[] {
  try {
    return JSON.parse(snapshot) as CartItem[];
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

  const cartSnapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot
  );

  const cart = useMemo(() => parseCart(cartSnapshot), [cartSnapshot]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);

  const [form, setForm] = useState<CustomerForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    country: "France",
    message: "",
  });

  useEffect(() => {
    const supabase = createClient();

    async function loadUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoadingSession(false);
        return;
      }

      setConnectedEmail(user.email ?? null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone")
        .eq("id", user.id)
        .maybeSingle<Profile>();

      const { data: address } = await supabase
        .from("user_addresses")
        .select(
          "first_name, last_name, address_line_1, postal_code, city, country"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle<UserAddress>();

      setForm((current) => ({
        ...current,
        email: user.email ?? current.email,
        firstName:
          profile?.first_name ?? address?.first_name ?? current.firstName,
        lastName: profile?.last_name ?? address?.last_name ?? current.lastName,
        phone: profile?.phone ?? current.phone,
        address: address?.address_line_1 ?? current.address,
        postalCode: address?.postal_code ?? current.postalCode,
        city: address?.city ?? current.city,
        country: address?.country ?? current.country,
      }));

      setIsLoadingSession(false);
    }

    loadUserData();
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  function updateField(field: keyof CustomerForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: form,
          items: cart,
        }),
      });

      const data = (await response.json()) as OrderResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Impossible d'envoyer la demande.");
      }

      setOrderId(data.orderId ?? null);
      setIsSubmitted(true);

      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new Event("tempel-cart-updated"));
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
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

          {orderId ? (
            <p className="mt-5 text-sm font-semibold text-[#9c7b4f]">
              Référence commande : {orderId.slice(0, 8).toUpperCase()}
            </p>
          ) : null}

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-neutral-600">
            Votre demande a bien été enregistrée. Vous pourrez la retrouver dans
            votre espace client.
          </p>

          <Link
            href={`/${locale}/mon-compte`}
            className="mt-8 inline-flex rounded-full bg-black px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#2b241f]"
          >
            Voir mon compte
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

            {connectedEmail ? (
              <div className="mt-6 flex gap-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-900">
                <UserCheck className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Vous êtes connecté</p>
                  <p className="mt-1 text-sm">
                    Cette commande sera associée à votre compte :{" "}
                    <span className="font-semibold">{connectedEmail}</span>
                  </p>
                </div>
              </div>
            ) : (
              !isLoadingSession && (
                <div className="mt-6 rounded-3xl border border-[#eadfca] bg-[#fbfaf7] p-5">
                  <p className="text-sm text-neutral-600">
                    Déjà client ?{" "}
                    <Link
                      href={`/${locale}/auth/login?redirectTo=/${locale}/checkout`}
                      className="font-semibold text-black underline"
                    >
                      Connectez-vous
                    </Link>{" "}
                    pour associer cette commande à votre compte.
                  </p>
                </div>
              )
            )}

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
                  readOnly={Boolean(connectedEmail)}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black read-only:cursor-not-allowed read-only:opacity-70"
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
                <label className="text-sm font-semibold">Pays *</label>
                <input
                  required
                  value={form.country}
                  onChange={(event) =>
                    updateField("country", event.target.value)
                  }
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

            {submitError ? (
              <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={cart.length === 0 || isSubmitting}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-black px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#2b241f] disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
            </button>
          </form>

          <aside className="h-fit rounded-[2rem] bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-semibold">Résumé du panier</h2>
            <p className="mt-2 text-sm font-medium text-emerald-600">
              Livraison gratuite
            </p>

            {cart.length === 0 ? (
              <div className="mt-8 rounded-3xl bg-[#f7f4ee] p-6 text-center">
                <ShoppingBag className="mx-auto h-8 w-8 text-neutral-400" />
                <p className="mt-4 text-sm text-neutral-600">
                  Votre panier est vide.
                </p>
              </div>
            ) : (
              <div className="mt-6 border-t border-black/10 pt-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}