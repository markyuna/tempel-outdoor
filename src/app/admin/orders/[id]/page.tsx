// src/app/admin/orders/[id]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  PackageCheck,
} from "lucide-react";

import DeleteOrderButton from "@/components/admin/orders/DeleteOrderButton";
import GenerateDevisButton from "@/components/admin/orders/GenerateDevisButton";
import OrderStatusSelect from "@/components/admin/orders/OrderStatusSelect";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type OrderItem = {
  id: string;
  product_name: string;
  product_slug: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  options: Record<string, string> | null;
};

type OrderAddressData = {
  customer_first_name?: string | null;
  customer_last_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  customer_address?: string | null;
  customer_postal_code?: string | null;
  customer_city?: string | null;
  customer_country?: string | null;

  billing_first_name?: string | null;
  billing_last_name?: string | null;
  billing_email?: string | null;
  billing_phone?: string | null;
  billing_address?: string | null;
  billing_postal_code?: string | null;
  billing_city?: string | null;
  billing_country?: string | null;

  shipping_first_name?: string | null;
  shipping_last_name?: string | null;
  shipping_email?: string | null;
  shipping_phone?: string | null;
  shipping_address?: string | null;
  shipping_postal_code?: string | null;
  shipping_city?: string | null;
  shipping_country?: string | null;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getFullName(firstName?: string | null, lastName?: string | null) {
  const fullName = `${firstName || ""} ${lastName || ""}`.trim();

  return fullName || "—";
}

function getAddressLines({
  address,
  postalCode,
  city,
  country,
}: {
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
}) {
  const postalCity = [postalCode, city].filter(Boolean).join(" ");
  const lines = [address, postalCity || null, country].filter(Boolean);

  return lines.length ? lines : ["—"];
}

async function getSignedDevisUrl(path: string | null) {
  if (!path) return null;

  const { data, error } = await supabaseAdmin.storage
    .from("devis")
    .createSignedUrl(path, 60 * 60);

  if (error) {
    console.error("Erreur lien devis:", error);
    return null;
  }

  return data.signedUrl;
}

async function deleteOrder(formData: FormData) {
  "use server";

  const orderId = String(formData.get("orderId") || "");

  if (!orderId) {
    return;
  }

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .delete()
    .eq("order_id", orderId);

  if (itemsError) {
    console.error("Erreur suppression produits commande:", itemsError);
    return;
  }

  const { error: orderError } = await supabaseAdmin
    .from("orders")
    .delete()
    .eq("id", orderId);

  if (orderError) {
    console.error("Erreur suppression commande:", orderError);
    return;
  }

  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select(
      `
      id,
      product_name,
      product_slug,
      product_image,
      quantity,
      unit_price,
      total_price,
      options
    `
    )
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  if (itemsError) {
    console.error("Erreur chargement produits commande:", itemsError);
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-6 py-10">
        <section className="mx-auto max-w-5xl">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux commandes
          </Link>

          <div className="mt-8 rounded-3xl bg-white p-8">
            <h1 className="text-2xl font-semibold">Commande introuvable</h1>
            <p className="mt-2 text-neutral-500">
              Aucune commande ne correspond à cet identifiant.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const orderItems = (items ?? []) as OrderItem[];
  const devisUrl = await getSignedDevisUrl(order.devis_pdf_url);
  const orderAddress = order as OrderAddressData;

  const billingFirstName =
    orderAddress.billing_first_name || orderAddress.customer_first_name;
  const billingLastName =
    orderAddress.billing_last_name || orderAddress.customer_last_name;
  const billingEmail = orderAddress.billing_email || orderAddress.customer_email;
  const billingPhone = orderAddress.billing_phone || orderAddress.customer_phone;
  const billingAddress =
    orderAddress.billing_address || orderAddress.customer_address;
  const billingPostalCode =
    orderAddress.billing_postal_code || orderAddress.customer_postal_code;
  const billingCity = orderAddress.billing_city || orderAddress.customer_city;
  const billingCountry =
    orderAddress.billing_country || orderAddress.customer_country;

  const shippingFirstName =
    orderAddress.shipping_first_name ||
    orderAddress.billing_first_name ||
    orderAddress.customer_first_name;
  const shippingLastName =
    orderAddress.shipping_last_name ||
    orderAddress.billing_last_name ||
    orderAddress.customer_last_name;
  const shippingEmail =
    orderAddress.shipping_email ||
    orderAddress.billing_email ||
    orderAddress.customer_email;
  const shippingPhone =
    orderAddress.shipping_phone ||
    orderAddress.billing_phone ||
    orderAddress.customer_phone;
  const shippingAddress =
    orderAddress.shipping_address ||
    orderAddress.billing_address ||
    orderAddress.customer_address;
  const shippingPostalCode =
    orderAddress.shipping_postal_code ||
    orderAddress.billing_postal_code ||
    orderAddress.customer_postal_code;
  const shippingCity =
    orderAddress.shipping_city ||
    orderAddress.billing_city ||
    orderAddress.customer_city;
  const shippingCountry =
    orderAddress.shipping_country ||
    orderAddress.billing_country ||
    orderAddress.customer_country;

  const billingAddressLines = getAddressLines({
    address: billingAddress,
    postalCode: billingPostalCode,
    city: billingCity,
    country: billingCountry,
  });

  const shippingAddressLines = getAddressLines({
    address: shippingAddress,
    postalCode: shippingPostalCode,
    city: shippingCity,
    country: shippingCountry,
  });

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux commandes
        </Link>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9c7b4f]">
            Commande #{order.id.slice(0, 8).toUpperCase()}
          </p>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-semibold text-[#181512]">
                {order.customer_first_name} {order.customer_last_name}
              </h1>

              <p className="mt-2 text-neutral-500">
                Créée le {formatDate(order.created_at)}
              </p>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <OrderStatusSelect
                orderId={order.id}
                currentStatus={order.status}
              />

              <GenerateDevisButton
                orderId={order.id}
                hasDevis={Boolean(order.devis_pdf_url)}
              />

              <DeleteOrderButton orderId={order.id} action={deleteOrder} />
            </div>
          </div>

          {order.devis_number ? (
            <div className="mt-8 rounded-3xl border border-[#9c7b4f]/30 bg-[#f7f4ee] p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9c7b4f]">
                    Devis généré
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-[#181512]">
                    {order.devis_number}
                  </h2>

                  {order.devis_generated_at ? (
                    <p className="mt-1 text-sm text-neutral-500">
                      Généré le {formatDate(order.devis_generated_at)}
                    </p>
                  ) : null}
                </div>

                {devisUrl ? (
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={devisUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#181512] transition hover:bg-black hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ouvrir
                    </a>

                    <a
                      href={devisUrl}
                      download
                      className="inline-flex items-center gap-2 rounded-full bg-[#181512] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b241f]"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-black/10 p-6">
              <h2 className="text-lg font-semibold">Facturation</h2>

              <div className="mt-4 space-y-2 text-sm text-neutral-600">
                <p>
                  <strong>Nom :</strong>{" "}
                  {getFullName(billingFirstName, billingLastName)}
                </p>

                <p>
                  <strong>Email :</strong> {billingEmail || "—"}
                </p>

                <p>
                  <strong>Téléphone :</strong> {billingPhone || "—"}
                </p>

                <div>
                  <strong>Adresse :</strong>

                  <div className="mt-2 rounded-2xl bg-[#f7f4ee] p-4 leading-6">
                    {billingAddressLines.map((line) => (
                      <p key={`billing-${line}`}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 p-6">
              <h2 className="text-lg font-semibold">Livraison</h2>

              <div className="mt-4 space-y-2 text-sm text-neutral-600">
                <p>
                  <strong>Nom :</strong>{" "}
                  {getFullName(shippingFirstName, shippingLastName)}
                </p>

                <p>
                  <strong>Email :</strong> {shippingEmail || "—"}
                </p>

                <p>
                  <strong>Téléphone :</strong> {shippingPhone || "—"}
                </p>

                <div>
                  <strong>Adresse :</strong>

                  <div className="mt-2 rounded-2xl bg-[#f7f4ee] p-4 leading-6">
                    {shippingAddressLines.map((line) => (
                      <p key={`shipping-${line}`}>{line}</p>
                    ))}
                  </div>
                </div>

                {!orderAddress.shipping_address ? (
                  <p className="pt-2 text-xs font-medium text-neutral-400">
                    Même adresse que la facturation.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-black/10 p-6">
            <h2 className="text-lg font-semibold">Montant</h2>

            <div className="mt-4 space-y-2 text-sm text-neutral-600">
              <p>
                <strong>Sous-total :</strong>{" "}
                {formatPrice(Number(order.subtotal || 0))}
              </p>

              <p>
                <strong>Livraison :</strong>{" "}
                {formatPrice(Number(order.delivery_price || 0))}
              </p>

              <p className="text-xl font-semibold text-black">
                Total : {formatPrice(Number(order.total || 0))}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-black/10 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Produits commandés</h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Articles inclus dans cette commande.
                </p>
              </div>

              <span className="rounded-full bg-[#f7f4ee] px-3 py-1 text-xs font-semibold">
                {orderItems.length} produit{orderItems.length > 1 ? "s" : ""}
              </span>
            </div>

            {orderItems.length > 0 ? (
              <div className="mt-6 space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 md:flex-row md:items-center"
                  >
                    <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-[#f7f4ee] md:h-24 md:w-28">
                      {item.product_image ? (
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <PackageCheck className="h-7 w-7 text-neutral-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-[#181512]">
                        {item.product_name}
                      </h3>

                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-400">
                        {item.product_slug}
                      </p>

                      {item.options && Object.keys(item.options).length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {Object.entries(item.options).map(([key, value]) => (
                            <span
                              key={`${item.id}-${key}`}
                              className="rounded-full bg-[#f7f4ee] px-3 py-1 text-xs font-medium text-neutral-600"
                            >
                              {key} : {String(value)}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="min-w-[170px] rounded-2xl bg-[#f7f4ee] p-4 text-sm">
                      <p className="text-neutral-500">
                        Quantité :{" "}
                        <span className="font-semibold text-black">
                          {item.quantity}
                        </span>
                      </p>

                      <p className="mt-1 text-neutral-500">
                        Prix :{" "}
                        <span className="font-semibold text-black">
                          {formatPrice(Number(item.unit_price || 0))}
                        </span>
                      </p>

                      <p className="mt-2 text-base font-semibold text-black">
                        {formatPrice(Number(item.total_price || 0))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-[#f7f4ee] p-6 text-sm text-neutral-500">
                Aucun produit trouvé pour cette commande.
              </div>
            )}
          </div>

          {order.customer_message ? (
            <div className="mt-6 rounded-3xl border border-black/10 p-6">
              <h2 className="text-lg font-semibold">Message client</h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-600">
                {order.customer_message}
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}