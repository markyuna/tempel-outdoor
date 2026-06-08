// src/app/admin/orders/[id]/page.tsx

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { supabaseAdmin } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{
    id: string;
  }>;
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

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

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

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-semibold text-[#181512]">
                {order.customer_first_name} {order.customer_last_name}
              </h1>

              <p className="mt-2 text-neutral-500">
                Créée le {formatDate(order.created_at)}
              </p>
            </div>

            <span className="rounded-full bg-[#f7f4ee] px-4 py-2 text-sm font-semibold">
              {getStatusLabel(order.status)}
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-black/10 p-6">
              <h2 className="text-lg font-semibold">Client</h2>

              <div className="mt-4 space-y-2 text-sm text-neutral-600">
                <p>
                  <strong>Email :</strong> {order.customer_email}
                </p>
                <p>
                  <strong>Téléphone :</strong> {order.customer_phone}
                </p>
                <p>
                  <strong>Ville :</strong> {order.customer_city || "—"}
                </p>
                <p>
                  <strong>Pays :</strong> {order.customer_country || "—"}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 p-6">
              <h2 className="text-lg font-semibold">Montant</h2>

              <div className="mt-4 space-y-2 text-sm text-neutral-600">
                <p>
                  <strong>Sous-total :</strong>{" "}
                  {formatPrice(Number(order.subtotal || 0))}
                </p>
                <p className="text-xl font-semibold text-black">
                  Total : {formatPrice(Number(order.total || 0))}
                </p>
              </div>
            </div>
          </div>

          {order.notes ? (
            <div className="mt-6 rounded-3xl border border-black/10 p-6">
              <h2 className="text-lg font-semibold">Message</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-600">
                {order.notes}
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}