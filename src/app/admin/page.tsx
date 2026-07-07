// src/app/admin/page.tsx

import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Image,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";


import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminCard = {
  title: string;
  description: string;
  href: string;
  icon: typeof Package;
};

type Order = {
  id: string;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_email: string | null;
  total: number | null;
  status: string | null;
  created_at: string | null;
};

const adminCards: AdminCard[] = [
  {
    title: "Produits",
    description: "Ajoutez, modifiez et organisez le catalogue.",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Réalisations",
    description: "Ajoutez les installations clients et projets livrés.",
    href: "/admin/realisations",
    icon: Image,
  },
  {
    title: "Commandes",
    description: "Suivez les demandes et commandes clients.",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Clients",
    description: "Consultez les contacts et clients.",
    href: "/admin/customers",
    icon: Users,
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getCustomerName(order: Order) {
  const fullName = `${order.customer_first_name || ""} ${
    order.customer_last_name || ""
  }`.trim();

  return fullName || order.customer_email || "Client sans nom";
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

export default async function AdminPage() {
  const { data: ordersData, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select(
      `
      id,
      customer_first_name,
      customer_last_name,
      customer_email,
      total,
      status,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  const { count: customersCount, error: customersError } = await supabaseAdmin
    .from("profiles")
    .select("id", { count: "exact", head: true });

  if (ordersError) {
    console.error("Erreur chargement commandes dashboard:", ordersError);
  }

  if (customersError) {
    console.error("Erreur chargement clients dashboard:", customersError);
  }

  const orders = (ordersData ?? []) as Order[];
  const latestOrders = orders.slice(0, 5);

  const totalOrders = orders.length;
  const newOrders = orders.filter((order) => order.status === "new").length;
  const potentialRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#f7f4ee]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[#9c7b4f]">
            Administration
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#181512] md:text-5xl">
            Dashboard Tempel Outdoor
          </h1>

          <p className="mt-4 text-lg leading-8 text-[#5f5a54]">
            Gérez le catalogue, les commandes, les clients et les contenus
            premium du site.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">Commandes totales</p>
            <p className="mt-2 text-3xl font-semibold text-[#181512]">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">Nouvelles commandes</p>
            <p className="mt-2 text-3xl font-semibold text-[#181512]">
              {newOrders}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">CA potentiel</p>
            <p className="mt-2 text-3xl font-semibold text-[#181512]">
              {formatPrice(potentialRevenue)}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">Clients enregistrés</p>
            <p className="mt-2 text-3xl font-semibold text-[#181512]">
              {customersCount ?? 0}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {adminCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white transition group-hover:scale-105">
                  <Icon size={22} />
                </div>

                <h2 className="text-xl font-semibold text-[#181512]">
                  {card.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-black/55">
                  {card.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-black/10 px-6 py-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-[#181512]">
                Dernières commandes
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Les commandes les plus récentes envoyées depuis le checkout.
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b241f]"
            >
              Toutes les commandes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {!latestOrders.length ? (
            <div className="px-6 py-14 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-[#9c7b4f]" />

              <h3 className="mt-4 text-xl font-semibold text-[#181512]">
                Aucune commande pour le moment
              </h3>

              <p className="mt-2 text-sm text-neutral-500">
                Les dernières commandes apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-[#181512] text-white">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Référence
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Client
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Statut
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Total
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/10">
                  {latestOrders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-[#f7f4ee]">
                      <td className="px-6 py-5">
                        <span className="font-mono text-sm font-semibold">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold text-[#181512]">
                          {getCustomerName(order)}
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                          {order.customer_email || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-semibold text-[#181512]">
                        {formatPrice(Number(order.total || 0))}
                      </td>

                      <td className="px-6 py-5 text-sm text-neutral-500">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2b241f]"
                        >
                          <Eye className="h-4 w-4" />
                          Voir
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
    </main>
  );
}