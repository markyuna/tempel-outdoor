// src/components/account/OrdersList.tsx

type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
};

type Props = {
  orders: Order[];
};

function getStatusLabel(status: string) {
  switch (status) {
    case "new":
      return "Nouvelle demande";
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

export default function OrdersList({ orders }: Props) {
  if (!orders.length) {
    return (
      <div className="rounded-3xl border bg-white p-8">
        <h3 className="text-xl font-semibold">Mes commandes</h3>

        <p className="mt-4 text-neutral-500">
          Vous n'avez encore passé aucune commande.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border bg-white p-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Mes commandes</h3>

        <span className="text-sm text-neutral-500">
          {orders.length} commande{orders.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border bg-[#fbfaf7] p-5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">Commande #{order.id.slice(0, 8)}</p>

                <p className="mt-1 text-sm text-neutral-500">
                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>

                <p className="text-lg font-semibold">
                  {Number(order.total).toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}