// src/app/[locale]/mon-compte/commandes/[id]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  FileText,
  Package,
  User,
} from "lucide-react";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

type Order = {
  id: string;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  customer_postal_code: string | null;
  customer_city: string | null;
  customer_country: string | null;
  customer_message: string | null;
  subtotal: number | null;
  delivery_price: number | null;
  total: number | null;
  status: string | null;
  created_at: string;
  devis_number: string | null;
  devis_pdf_url: string | null;
  devis_generated_at: string | null;
  devis_sent_at: string | null;
  user_id: string | null;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_slug: string | null;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  options: Record<string, string | number | boolean | null> | null;
  created_at: string;
};

function formatPrice(value: number | null) {
  return Number(value || 0).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

function formatDate(value: string | null) {
  if (!value) return "Date non disponible";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusLabel(status: string | null) {
  const labels: Record<string, string> = {
    new: "Nouvelle demande",
    contacted: "Client contacté",
    quoted: "Devis envoyé",
    paid: "Payée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  return labels[status || ""] ?? "En cours";
}

function getStatusClasses(status: string | null) {
  const classes: Record<string, string> = {
    new: "bg-blue-50 text-blue-700",
    contacted: "bg-purple-50 text-purple-700",
    quoted: "bg-[#f3ead6] text-[#7a5b1c]",
    paid: "bg-emerald-50 text-emerald-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return classes[status || ""] ?? "bg-neutral-100 text-neutral-600";
}

export default async function ClientOrderDetailPage({ params }: Props) {
  const { locale, id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/${locale}/auth/login`);
  }

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select(
      `
      id,
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_postal_code,
      customer_city,
      customer_country,
      customer_message,
      subtotal,
      delivery_price,
      total,
      status,
      created_at,
      devis_number,
      devis_pdf_url,
      devis_generated_at,
      devis_sent_at,
      user_id
    `
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<Order>();

  if (orderError) {
    console.error("Erreur chargement détail commande client:", orderError);
  }

  if (!order) {
    notFound();
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select(
      `
      id,
      order_id,
      product_id,
      product_name,
      product_slug,
      product_image,
      quantity,
      unit_price,
      total_price,
      options,
      created_at
    `
    )
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  if (itemsError) {
    console.error("Erreur chargement produits commande client:", itemsError);
  }

  const orderItems = (items ?? []) as OrderItem[];

  const customerName =
    [order.customer_first_name, order.customer_last_name]
      .filter(Boolean)
      .join(" ") || "Client";

  const address = [
    order.customer_address,
    order.customer_postal_code,
    order.customer_city,
    order.customer_country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-28 text-[#181512]">
      <section className="mx-auto max-w-6xl">
        <Link
          href={`/${locale}/mon-compte`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à mon compte
        </Link>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#9c7b4f]">
                Détail commande
              </p>

              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                Commande #{order.id.slice(0, 7)}
              </h1>

              <div className="mt-5 flex flex-wrap gap-3">
                <span
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${getStatusClasses(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-[#f7f4ee] px-4 py-2 text-sm text-neutral-600">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(order.created_at)}
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-[#181512] px-6 py-5 text-white">
              <p className="text-sm text-white/60">Total commande</p>
              <p className="mt-1 text-3xl font-semibold">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="rounded-[2rem] bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f4ee]">
                  <Package className="h-5 w-5 text-[#9c7b4f]" />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold">
                    Produits commandés
                  </h2>
                  <p className="text-sm text-neutral-500">
                    {orderItems.length} produit(s)
                  </p>
                </div>
              </div>

              {orderItems.length === 0 ? (
                <div className="rounded-3xl bg-[#f7f4ee] p-6 text-sm text-neutral-600">
                  Aucun produit trouvé pour cette commande.
                </div>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <article
                      key={item.id}
                      className="grid gap-5 rounded-3xl border border-black/10 p-5 md:grid-cols-[110px_1fr_auto]"
                    >
                      <Link
                        href={
                          item.product_slug
                            ? `/${locale}/products/${item.product_slug}`
                            : `/${locale}`
                        }
                        className="relative aspect-square overflow-hidden rounded-2xl bg-[#f7f4ee]"
                      >
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                            sizes="110px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-7 w-7 text-neutral-300" />
                          </div>
                        )}
                      </Link>

                      <div>
                        <Link
                          href={
                            item.product_slug
                              ? `/${locale}/products/${item.product_slug}`
                              : `/${locale}`
                          }
                          className="text-lg font-semibold transition hover:text-[#9c7b4f]"
                        >
                          {item.product_name}
                        </Link>

                        <p className="mt-2 text-sm text-neutral-500">
                          Quantité : {item.quantity}
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                          Prix unitaire : {formatPrice(item.unit_price)}
                        </p>

                        {item.options &&
                        Object.keys(item.options).length > 0 ? (
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

                      <div className="flex items-center justify-between md:block md:text-right">
                        <p className="text-sm text-neutral-500">Total</p>
                        <p className="mt-1 text-lg font-semibold">
                          {formatPrice(item.total_price)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {order.customer_message ? (
              <section className="rounded-[2rem] bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold">Message client</h2>

                <p className="mt-4 rounded-3xl bg-[#f7f4ee] p-5 text-sm leading-6 text-neutral-700">
                  {order.customer_message}
                </p>
              </section>
            ) : null}
          </div>

          <aside className="space-y-8">
            <section className="rounded-[2rem] bg-white p-7 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f4ee]">
                  <User className="h-5 w-5 text-[#9c7b4f]" />
                </div>

                <h2 className="text-xl font-semibold">Client</h2>
              </div>

              <div className="space-y-4 text-sm">
                <InfoLine label="Nom" value={customerName} />
                <InfoLine label="Email" value={order.customer_email} />
                <InfoLine label="Téléphone" value={order.customer_phone} />
                <InfoLine label="Adresse" value={address || "Non renseignée"} />
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-7 shadow-sm">
              <h2 className="text-xl font-semibold">Résumé</h2>

              <div className="mt-6 space-y-4 border-b border-black/10 pb-5">
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Sous-total</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Livraison</span>
                  <span>
                    {Number(order.delivery_price || 0) === 0
                      ? "Gratuite"
                      : formatPrice(order.delivery_price)}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-7 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f4ee]">
                  <FileText className="h-5 w-5 text-[#9c7b4f]" />
                </div>

                <h2 className="text-xl font-semibold">Devis</h2>
              </div>

              {order.devis_pdf_url ? (
                <div>
                  <p className="text-sm text-neutral-600">
                    {order.devis_number
                      ? `Devis ${order.devis_number}`
                      : "Devis disponible"}
                  </p>

                  {order.devis_generated_at ? (
                    <p className="mt-1 text-xs text-neutral-400">
                      Généré le {formatDate(order.devis_generated_at)}
                    </p>
                  ) : null}

                  <a
                    href={order.devis_pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#2b241f]"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger le devis
                  </a>
                </div>
              ) : (
                <p className="text-sm leading-6 text-neutral-600">
                  Aucun devis PDF n’est encore disponible pour cette commande.
                </p>
              )}
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function InfoLine({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </p>

      <p className="mt-1 font-medium text-[#181512]">
        {value || "Non renseigné"}
      </p>
    </div>
  );
}