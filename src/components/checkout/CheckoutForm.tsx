// src/components/checkout/CheckoutForm.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShoppingBag,
  UserCheck,
} from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";

type CartItem = {
  id: string;
  productId?: string;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
  imageUrl?: string | null;
  quantity: number;
  options?: Record<string, string | number | boolean | null>;
};

type CustomerForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  billingAddress: string;
  billingPostalCode: string;
  billingCity: string;
  billingCountry: string;

  shippingSameAsBilling: boolean;
  shippingAddress: string;
  shippingPostalCode: string;
  shippingCity: string;
  shippingCountry: string;

  message: string;
};

type Profile = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
} | null;

type CheckoutFormProps = {
  locale: string;
  userId?: string | null;
  userEmail?: string;
  profile?: Profile;
};

type OrderResponse = {
  success?: boolean;
  orderId?: string;
  error?: string;
};

import { CART_STORAGE_KEY, CART_UPDATED_EVENT } from "@/lib/cart";

const emptyForm: CustomerForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",

  billingAddress: "",
  billingPostalCode: "",
  billingCity: "",
  billingCountry: "France",

  shippingSameAsBilling: true,
  shippingAddress: "",
  shippingPostalCode: "",
  shippingCity: "",
  shippingCountry: "France",

  message: "",
};

function subscribeToCart(callback: () => void) {
  window.addEventListener(CART_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getCartSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(CART_STORAGE_KEY) || "[]";
}

function getServerCartSnapshot() {
  return "[]";
}

function normalizeCartItem(item: CartItem): CartItem {
  return {
    id: item.id,
    productId: item.productId ?? item.id,
    name: item.name,
    slug: item.slug,
    price: Number(item.price || 0),
    image: item.image ?? item.imageUrl ?? null,
    imageUrl: item.imageUrl ?? item.image ?? null,
    quantity: Math.max(1, Number(item.quantity || 1)),
    options: item.options ?? undefined,
  };
}

function parseCart(snapshot: string): CartItem[] {
  try {
    const parsedCart = JSON.parse(snapshot);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.map(normalizeCartItem);
  } catch {
    return [];
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
}

function getInitialForm(profile?: Profile, userEmail?: string): CustomerForm {
  const billingCountry = profile?.country || "France";

  return {
    ...emptyForm,
    firstName: profile?.first_name ?? "",
    lastName: profile?.last_name ?? "",
    email: profile?.email ?? userEmail ?? "",
    phone: profile?.phone ?? "",

    billingAddress: profile?.address ?? "",
    billingPostalCode: profile?.postal_code ?? "",
    billingCity: profile?.city ?? "",
    billingCountry,

    shippingSameAsBilling: true,
    shippingAddress: profile?.address ?? "",
    shippingPostalCode: profile?.postal_code ?? "",
    shippingCity: profile?.city ?? "",
    shippingCountry: billingCountry,

    message: "",
  };
}

export default function CheckoutForm({
  locale,
  userId,
  userEmail,
  profile,
}: CheckoutFormProps) {
  const router = useRouter();

  const cartSnapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot
  );

  const cart = useMemo(() => parseCart(cartSnapshot), [cartSnapshot]);

  const [form, setForm] = useState<CustomerForm>(() =>
    getInitialForm(profile, userEmail)
  );

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
  }, [cart]);

  function updateField(field: keyof CustomerForm, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cart.length === 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const customerPayload = {
      ...form,
      shippingAddress: form.shippingSameAsBilling
        ? form.billingAddress
        : form.shippingAddress,
      shippingPostalCode: form.shippingSameAsBilling
        ? form.billingPostalCode
        : form.shippingPostalCode,
      shippingCity: form.shippingSameAsBilling
        ? form.billingCity
        : form.shippingCity,
      shippingCountry: form.shippingSameAsBilling
        ? form.billingCountry
        : form.shippingCountry,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: customerPayload,
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
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));

      router.refresh();
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

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/${locale}/mon-compte`}
            className="inline-flex rounded-full bg-black px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#2b241f]"
          >
            Voir mon compte
          </Link>

          <Link
            href={`/${locale}`}
            className="inline-flex rounded-full border border-black/10 px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#181512] transition hover:bg-[#f7f4ee]"
          >
            Continuer mes achats
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
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

          {userId ? (
            <div className="mt-6 flex gap-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-900">
              <UserCheck className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-semibold">Vous êtes connecté</p>

                <p className="mt-1 text-sm">
                  Cette commande sera associée à votre compte :{" "}
                  <span className="font-semibold">
                    {userEmail || form.email}
                  </span>
                </p>
              </div>
            </div>
          ) : (
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
                autoComplete="given-name"
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
                autoComplete="family-name"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Email *</label>

              <input
                required
                type="email"
                value={form.email}
                readOnly={Boolean(userEmail)}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
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
                autoComplete="tel"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
              />
            </div>
          </div>

          <div className="mt-12 border-t border-black/10 pt-10">
            <h2 className="text-2xl font-semibold">
              Adresse de facturation
            </h2>

            <p className="mt-2 text-sm text-neutral-600">
              Cette adresse sera utilisée pour vos informations de commande et
              votre devis.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold">Adresse</label>

                <input
                  value={form.billingAddress}
                  onChange={(event) =>
                    updateField("billingAddress", event.target.value)
                  }
                  autoComplete="billing street-address"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Code postal</label>

                <input
                  value={form.billingPostalCode}
                  onChange={(event) =>
                    updateField("billingPostalCode", event.target.value)
                  }
                  autoComplete="billing postal-code"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Ville</label>

                <input
                  value={form.billingCity}
                  onChange={(event) =>
                    updateField("billingCity", event.target.value)
                  }
                  autoComplete="billing address-level2"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold">Pays *</label>

                <input
                  required
                  value={form.billingCountry}
                  onChange={(event) =>
                    updateField("billingCountry", event.target.value)
                  }
                  autoComplete="billing country-name"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-black/10 bg-[#fbfaf7] p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.shippingSameAsBilling}
                onChange={(event) =>
                  updateField("shippingSameAsBilling", event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-black"
              />

              <span>
                <span className="block text-sm font-semibold text-[#181512]">
                  L’adresse de livraison est identique à l’adresse de
                  facturation
                </span>

                <span className="mt-1 block text-sm text-neutral-600">
                  Décochez cette option si le spa, sauna ou équipement doit être
                  livré à une autre adresse.
                </span>
              </span>
            </label>
          </div>

          {!form.shippingSameAsBilling ? (
            <div className="mt-10 border-t border-black/10 pt-10">
              <h2 className="text-2xl font-semibold">
                Adresse de livraison
              </h2>

              <p className="mt-2 text-sm text-neutral-600">
                Indiquez l’adresse exacte où le produit devra être livré.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">Adresse *</label>

                  <input
                    required={!form.shippingSameAsBilling}
                    value={form.shippingAddress}
                    onChange={(event) =>
                      updateField("shippingAddress", event.target.value)
                    }
                    autoComplete="shipping street-address"
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Code postal *
                  </label>

                  <input
                    required={!form.shippingSameAsBilling}
                    value={form.shippingPostalCode}
                    onChange={(event) =>
                      updateField("shippingPostalCode", event.target.value)
                    }
                    autoComplete="shipping postal-code"
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Ville *</label>

                  <input
                    required={!form.shippingSameAsBilling}
                    value={form.shippingCity}
                    onChange={(event) =>
                      updateField("shippingCity", event.target.value)
                    }
                    autoComplete="shipping address-level2"
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">Pays *</label>

                  <input
                    required={!form.shippingSameAsBilling}
                    value={form.shippingCountry}
                    onChange={(event) =>
                      updateField("shippingCountry", event.target.value)
                    }
                    autoComplete="shipping country-name"
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-10">
            <label className="text-sm font-semibold">
              Message ou précision
            </label>

            <textarea
              rows={5}
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Exemple : accès jardin, besoin d'installation, date souhaitée..."
              className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
            />
          </div>

          {submitError ? (
            <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {submitError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={cart.length === 0 || isSubmitting}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#2b241f] disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer ma demande"
            )}
          </button>
        </form>

        <aside className="h-fit rounded-[2rem] bg-white p-7 shadow-sm lg:sticky lg:top-28">
          <h2 className="text-2xl font-semibold">Résumé du panier</h2>

          <p className="mt-2 text-sm font-medium text-[#9c7b4f]">
            Livraison sur devis
          </p>

          {cart.length === 0 ? (
            <div className="mt-8 rounded-3xl bg-[#f7f4ee] p-6 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-neutral-400" />

              <p className="mt-4 text-sm text-neutral-600">
                Votre panier est vide.
              </p>

              <Link
                href={`/${locale}`}
                className="mt-5 inline-flex rounded-full bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white"
              >
                Retour boutique
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <div className="space-y-4 border-t border-black/10 pt-6">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${JSON.stringify(item.options ?? {})}`}
                    className="border-b border-black/10 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-medium">{item.name}</p>

                        <p className="mt-1 text-sm text-neutral-500">
                          Quantité : {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 font-semibold">
                        {formatPrice(
                          Number(item.price || 0) * Number(item.quantity || 1)
                        )}
                      </p>
                    </div>

                    {item.options && Object.keys(item.options).length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(item.options).map(([key, value]) => (
                          <span
                            key={key}
                            className="rounded-full bg-[#f7f4ee] px-3 py-1 text-xs text-neutral-600"
                          >
                            {key} : {String(value)}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="border-t border-black/10 pt-6">
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="mt-3 flex justify-between text-sm text-neutral-500">
                  <span>Livraison</span>
                  <span>Sur devis</span>
                </div>

                <div className="mt-6 flex justify-between text-lg font-semibold">
                  <span>Total estimé</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}