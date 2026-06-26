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
  if (!value) return "—";
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
    in_production: "En fabrication",
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
    in_production: "bg-amber-50 text-amber-700",
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
    [order.customer_postal_code, order.customer_city].filter(Boolean).join(" "),
    order.customer_country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-20 text-[#181512]">
      <section className="mx-auto max-w-6xl">
        <Link
          href={`/${locale}/mon-compte`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à mon compte
        </Link>

        {/* Header */}
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9c7b4f]">
                Détail commande
              </p>

              <h1 className="mt-1.5 text-2xl font-semibold tracking-tight md:text-3xl">
                Commande #{order.id.slice(0, 8)}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClasses(order.status)}`}
                >
                  {getStatusLabel(order.status)}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f4ee] px-3 py-1.5 text-xs text-neutral-500">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(order.created_at)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#181512] px-5 py-4 text-white">
              <p className="text-xs text-white/60">Total commande</p>
              <p className="mt-1 text-2xl font-semibold">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-5">
            {/* Products */}
            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-[#9c7b4f]" />
                <h2 className="text-lg font-semibold">Produits commandés</h2>
                <span className="ml-auto text-sm text-neutral-400">
                  {orderItems.length} article{orderItems.length > 1 ? "s" : ""}
                </span>
              </div>

              {orderItems.length === 0 ? (
                <div className="rounded-2xl bg-[#f7f4ee] p-5 text-sm text-neutral-600">
                  Aucun produit trouvé pour cette commande.
                </div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => {
                    const productHref = item.product_slug
                      ? `/${locale}/products/${item.product_slug}`
                      : `/${locale}`;

                    return (
                      <article
                        key={item.id}
                        className="flex gap-4 rounded-2xl border border-black/10 p-4"
                      >
                        <Link
                          href={productHref}
                          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f7f4ee]"
                        >
                          {item.product_image ? (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package className="h-5 w-5 text-neutral-300" />
                            </div>
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <Link
                              href={productHref}
                              className="text-sm font-semibold transition hover:text-[#9c7b4f]"
                            >
                              {item.product_name}
                            </Link>

                            <p className="mt-0.5 text-xs text-neutral-500">
                              Qté {item.quantity} · {formatPrice(item.unit_price)} / unité
                            </p>

                            {item.options && Object.keys(item.options).length > 0 ? (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {Object.entries(item.options).map(([key, value]) => (
                                  <span
                                    key={key}
                                    className="rounded-full bg-[#f7f4ee] px-2.5 py-0.5 text-xs text-neutral-600"
                                  >
                                    {key} : {String(value)}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold">
                            {formatPrice(item.total_price)}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Message */}
            {order.customer_message ? (
              <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold">Votre message</h2>

                <p className="mt-3 rounded-2xl bg-[#f7f4ee] p-4 text-sm leading-6 text-neutral-700">
                  {order.customer_message}
                </p>
              </section>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Résumé + coordonnées fusionnées */}
            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold">Résumé</h2>

              <div className="mt-4 space-y-2 border-b border-black/10 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Sous-total</span>
                  <span className="font-medium">{formatPrice(order.subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Livraison</span>
                  <span className="font-medium">
                    {Number(order.delivery_price || 0) === 0
                      ? "Sur devis"
                      : formatPrice(order.delivery_price)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>

              <div className="mt-5 border-t border-black/10 pt-5 space-y-3 text-sm">
                <InfoLine label="Nom" value={customerName} />
                <InfoLine label="Email" value={order.customer_email} />
                <InfoLine label="Téléphone" value={order.customer_phone} />
                {address ? <InfoLine label="Adresse" value={address} /> : null}
              </div>
            </section>

            {/* Devis */}
            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#9c7b4f]" />
                <h2 className="text-base font-semibold">Devis</h2>
              </div>

              {order.devis_pdf_url ? (
                <div className="mt-4">
                  <p className="text-sm font-medium text-[#181512]">
                    {order.devis_number ?? "Devis disponible"}
                  </p>

                  {order.devis_generated_at ? (
                    <p className="mt-0.5 text-xs text-neutral-400">
                      Généré le {formatDate(order.devis_generated_at)}
                    </p>
                  ) : null}

                  <a
                    href={`/api/orders/${order.id}/download-devis`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b241f]"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger le devis
                  </a>
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  Aucun devis disponible pour le moment. Nous vous contacterons
                  prochainement.
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
  if (!value) return null;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-[#181512]">{value}</p>
    </div>
  );
}
