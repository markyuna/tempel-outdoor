// src/app/admin/customers/[id]/page.tsx

import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Customer = {
  id: string;
  user_id: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  role: string | null;
  created_at: string | null;
};

type Order = {
  id: string;
  user_id: string | null;
  customer_email: string | null;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_phone: string | null;
  customer_city: string | null;
  customer_country: string | null;
  subtotal: number | null;
  total: number | null;
  status: string | null;
  created_at: string | null;
};

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function getCustomerName(customer: Customer) {
  const fullName = `${customer.first_name || ""} ${
    customer.last_name || ""
  }`.trim();

  return fullName || "Client sans nom";
}

function getStatusLabel(status: string | null) {
  const labels: Record<string, string> = {
    new: "Nouvelle",
    contacted: "Contacté",
    quoted: "Devis envoyé",
    paid: "Payée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  return labels[status || ""] || status || "—";
}

function getStatusClass(status: string | null) {
  const classes: Record<string, string> = {
    new: "bg-amber-100 text-amber-800",
    contacted: "bg-blue-100 text-blue-800",
    quoted: "bg-purple-100 text-purple-800",
    paid: "bg-emerald-100 text-emerald-800",
    delivered: "bg-neutral-900 text-white",
    cancelled: "bg-red-100 text-red-800",
  };

  return classes[status || ""] || "bg-[#f7f4ee] text-[#181512]";
}

async function getCustomerOrders(customer: Customer) {
  let ordersByUserId: Order[] = [];
  let ordersByEmail: Order[] = [];

  if (customer.user_id) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        user_id,
        customer_email,
        customer_first_name,
        customer_last_name,
        customer_phone,
        customer_city,
        customer_country,
        subtotal,
        total,
        status,
        created_at
      `
      )
      .eq("user_id", customer.user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur chargement commandes client par user_id:", error);
    }

    ordersByUserId = (data ?? []) as Order[];
  }

  if (customer.email) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        user_id,
        customer_email,
        customer_first_name,
        customer_last_name,
        customer_phone,
        customer_city,
        customer_country,
        subtotal,
        total,
        status,
        created_at
      `
      )
      .eq("customer_email", customer.email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur chargement commandes client par email:", error);
    }

    ordersByEmail = (data ?? []) as Order[];
  }

  const uniqueOrders = new Map<string, Order>();

  [...ordersByUserId, ...ordersByEmail].forEach((order) => {
    uniqueOrders.set(order.id, order);
  });

  return Array.from(uniqueOrders.values()).sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

    return dateB - dateA;
  });
}

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: customerData, error } = await supabaseAdmin
    .from("profiles")
    .select(
      `
      id,
      user_id,
      first_name,
      last_name,
      email,
      phone,
      address,
      postal_code,
      city,
      country,
      role,
      created_at
    `
    )
    .eq("id", id)
    .single();

  if (error || !customerData) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-6 py-10">
        <section className="mx-auto max-w-5xl">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux clients
          </Link>

          <div className="mt-8 rounded-3xl bg-white p-8">
            <h1 className="text-2xl font-semibold">Client introuvable</h1>
            <p className="mt-2 text-neutral-500">
              Aucun client ne correspond à cet identifiant.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const customer = customerData as Customer;
  const orders = await getCustomerOrders(customer);

  const totalSpent = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const lastOrder = orders[0] ?? null;
  const postalCity = [customer.postal_code, customer.city]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux clients
        </Link>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f4ee]">
                <UserRound className="h-8 w-8 text-[#9c7b4f]" />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9c7b4f]">
                  Client #{customer.id.slice(0, 8).toUpperCase()}
                </p>

                <h1 className="text-3xl font-semibold text-[#181512] md:text-5xl">
                  {getCustomerName(customer)}
                </h1>

                <p className="mt-3 text-neutral-500">
                  Compte créé le {formatDate(customer.created_at)}
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full bg-[#f7f4ee] px-4 py-2 text-sm font-semibold text-[#181512]">
              {customer.role || "customer"}
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-black/10 p-6">
              <p className="text-sm text-neutral-500">Commandes</p>
              <p className="mt-2 text-3xl font-semibold text-[#181512]">
                {orders.length}
              </p>
            </div>

            <div className="rounded-3xl border border-black/10 p-6">
              <p className="text-sm text-neutral-500">Total dépensé</p>
              <p className="mt-2 text-3xl font-semibold text-[#181512]">
                {formatPrice(totalSpent)}
              </p>
            </div>

            <div className="rounded-3xl border border-black/10 p-6">
              <p className="text-sm text-neutral-500">Dernière commande</p>
              <p className="mt-2 text-lg font-semibold text-[#181512]">
                {lastOrder ? formatDate(lastOrder.created_at) : "—"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-black/10 p-6">
              <h2 className="text-lg font-semibold text-[#181512]">
                Coordonnées
              </h2>

              <div className="mt-5 space-y-3 text-sm text-neutral-600">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-neutral-400" />
                  {customer.email || "—"}
                </p>

                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-neutral-400" />
                  {customer.phone || "—"}
                </p>

                <p className="flex items-start gap-2">
                  <MapPin className="mt-1 h-4 w-4 text-neutral-400" />
                  <span>
                    {customer.address || "Adresse non renseignée"}
                    <br />
                    {postalCity || "—"}
                    <br />
                    {customer.country || "—"}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 p-6">
              <h2 className="text-lg font-semibold text-[#181512]">
                Informations compte
              </h2>

              <div className="mt-5 space-y-3 text-sm text-neutral-600">
                <p>
                  <strong>ID profil :</strong>{" "}
                  <span className="font-mono text-xs">{customer.id}</span>
                </p>

                <p>
                  <strong>ID utilisateur :</strong>{" "}
                  <span className="font-mono text-xs">
                    {customer.user_id || "—"}
                  </span>
                </p>

                <p>
                  <strong>Rôle :</strong> {customer.role || "customer"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-black/10 p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-lg font-semibold text-[#181512]">
                  Historique des commandes
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Toutes les commandes associées à ce client.
                </p>
              </div>

              <span className="flex w-fit items-center gap-2 rounded-full bg-[#f7f4ee] px-4 py-2 text-sm font-semibold">
                <ShoppingBag className="h-4 w-4" />
                {orders.length} commande{orders.length > 1 ? "s" : ""}
              </span>
            </div>

            {!orders.length ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-3xl bg-[#f7f4ee] px-6 py-14 text-center">
                <PackageCheck className="h-8 w-8 text-[#9c7b4f]" />

                <h3 className="mt-4 text-xl font-semibold text-[#181512]">
                  Aucune commande
                </h3>

                <p className="mt-2 max-w-md text-sm text-neutral-500">
                  Ce client n’a pas encore passé de commande.
                </p>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="bg-[#181512] text-white">
                    <tr>
                      <th className="rounded-l-2xl px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                        Référence
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                        Date
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                        Statut
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                        Total
                      </th>

                      <th className="rounded-r-2xl px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-black/10">
                    {orders.map((order) => (
                      <tr key={order.id} className="transition hover:bg-[#f7f4ee]">
                        <td className="px-5 py-5">
                          <span className="font-mono text-sm font-semibold">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-sm text-neutral-500">
                          {formatDate(order.created_at)}
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </td>

                        <td className="px-5 py-5 font-semibold text-[#181512]">
                          {formatPrice(Number(order.total || 0))}
                        </td>

                        <td className="px-5 py-5 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2b241f]"
                          >
                            <Eye className="h-4 w-4" />
                            Voir commande
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}