// src/components/account/OrdersList.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
};

type Props = {
  locale?: string;
  orders: Order[];
};

function getStatusLabel(status: string) {
  switch (status) {
    case "new":
      return "Nouvelle demande";
    case "contacted":
      return "Client contacté";
    case "quoted":
      return "Devis envoyé";
    case "paid":
      return "Payée";
    case "in_production":
      return "En fabrication";
    case "delivered":
      return "Livrée";
    case "cancelled":
      return "Annulée";
    default:
      return status;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-700";
    case "contacted":
      return "bg-purple-100 text-purple-700";
    case "quoted":
      return "bg-[#f3ead2] text-[#8a6a2f]";
    case "paid":
      return "bg-green-100 text-green-700";
    case "in_production":
      return "bg-amber-100 text-amber-700";
    case "delivered":
      return "bg-emerald-100 text-emerald-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

function formatPrice(value: number) {
  return Number(value || 0).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR");
}

export default function OrdersList({ locale = "fr", orders }: Props) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#181512]">Mes commandes</h2>

        {orders.length > 0 && (
          <span className="text-sm text-neutral-500">
            {orders.length} commande{orders.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">
          Vous n&apos;avez encore passé aucune commande.
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/${locale}/mon-compte/commandes/${order.id}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-3 transition hover:bg-white hover:shadow-sm"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#181512]">
                  Commande #{order.id.slice(0, 8)}
                </p>

                <p className="mt-0.5 text-xs text-neutral-500">
                  {formatDate(order.created_at)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ${getStatusColor(order.status)}`}
                >
                  {getStatusLabel(order.status)}
                </span>

                <p className="text-sm font-semibold text-[#181512]">
                  {formatPrice(order.total)}
                </p>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#181512] transition group-hover:bg-[#181512] group-hover:text-white">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
