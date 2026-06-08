// src/components/account/DevisList.tsx

type DevisOrder = {
  id: string;
  created_at: string;
  total: number;
  status: string;
  devis_number: string | null;
  devis_pdf_url: string | null;
  devis_generated_at: string | null;
};

type Props = {
  orders: DevisOrder[];
};

export default function DevisList({ orders }: Props) {
  const devisOrders = orders.filter((order) => order.devis_pdf_url);

  if (!devisOrders.length) {
    return (
      <div className="rounded-3xl border bg-white p-8">
        <h3 className="text-xl font-semibold">Mes devis</h3>
        <p className="mt-4 text-neutral-500">
          Aucun devis n’est disponible pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border bg-white p-8">
      <h3 className="text-xl font-semibold">Mes devis</h3>

      <div className="mt-6 space-y-4">
        {devisOrders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-4 rounded-2xl border p-5 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold">
                {order.devis_number ?? `Devis #${order.id.slice(0, 8)}`}
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Généré le{" "}
                {order.devis_generated_at
                  ? new Date(order.devis_generated_at).toLocaleDateString(
                      "fr-FR"
                    )
                  : new Date(order.created_at).toLocaleDateString("fr-FR")}
              </p>

              <p className="mt-1 text-sm font-medium">
                {Number(order.total).toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>

            <a
              href={`/api/orders/${order.id}/download-devis`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-[#d7b86e] hover:text-black"
            >
              Télécharger le devis
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}