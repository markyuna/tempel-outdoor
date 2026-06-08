// src/app/admin/orders/page.tsx

import Link from "next/link";
import { Eye, PackageCheck } from "lucide-react";

import { supabaseAdmin } from "@/lib/supabase/admin";

type Order = {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  customer_city: string | null;
  customer_country: string | null;
  subtotal: number;
  total: number;
  status: string;
  created_at: string;
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

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    new: "Nouvelle",
    contacted: "Contacté",
    quoted: "Devis envoyé",
    paid: "Payée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  return labels[status] || status;
}

export default async function AdminOrdersPage() {
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
      id,
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
      customer_city,
      customer_country,
      subtotal,
      total,
      status,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur chargement commandes:", error);
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9c7b4f]">
              Administration
            </p>

            <h1 className="text-3xl font-semibold text-[#181512] md:text-5xl">
              Commandes
            </h1>

            <p className="mt-3 text-neutral-600">
              Consultez les demandes envoyées depuis le checkout Tempel Outdoor.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#181512] transition hover:bg-black hover:text-white"
          >
            Retour dashboard
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">Commandes totales</p>
            <p className="mt-2 text-3xl font-semibold">
              {orders?.length ?? 0}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">Nouvelles commandes</p>
            <p className="mt-2 text-3xl font-semibold">
              {orders?.filter((order) => order.status === "new").length ?? 0}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">CA potentiel</p>
            <p className="mt-2 text-3xl font-semibold">
              {formatPrice(
                orders?.reduce(
                  (total, order) => total + Number(order.total || 0),
                  0
                ) ?? 0
              )}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-sm">
          {!orders?.length ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f4ee]">
                <PackageCheck className="h-7 w-7 text-[#9c7b4f]" />
              </div>

              <h2 className="text-2xl font-semibold text-[#181512]">
                Aucune commande pour le moment
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
                Les commandes envoyées depuis le checkout apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-[#181512] text-white">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Référence
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Client
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Localisation
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Total
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Statut
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
                  {orders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-[#f7f4ee]">
                      <td className="px-6 py-5">
                        <span className="font-mono text-sm font-semibold">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold">
                          {order.customer_first_name}{" "}
                          {order.customer_last_name}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm text-neutral-700">
                          {order.customer_email}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                          {order.customer_phone}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm text-neutral-700">
                          {order.customer_city || "—"}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                          {order.customer_country || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {formatPrice(Number(order.total))}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#f7f4ee] px-3 py-1 text-xs font-semibold">
                          {getStatusLabel(order.status)}
                        </span>
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
      </section>
    </main>
  );
}