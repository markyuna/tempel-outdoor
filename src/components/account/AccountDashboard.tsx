// src/components/account/AccountDashboard.tsx

import DevisList from "@/components/account/DevisList";
import OrdersList from "@/components/account/OrdersList";
import LogoutButton from "@/components/auth/LogoutButton";

type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
  devis_number: string | null;
  devis_pdf_url: string | null;
  devis_generated_at: string | null;
};

type Props = {
  email: string;
  orders: Order[];
};

export default function AccountDashboard({ email, orders }: Props) {
  const devisCount = orders.filter((order) => order.devis_pdf_url).length;
  const totalAmount = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  return (
    <section className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6">
          <p className="text-sm text-neutral-500">Commandes</p>
          <p className="mt-2 text-3xl font-semibold">{orders.length}</p>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-sm text-neutral-500">Devis disponibles</p>
          <p className="mt-2 text-3xl font-semibold">{devisCount}</p>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-sm text-neutral-500">Total commandes</p>
          <p className="mt-2 text-3xl font-semibold">
            {totalAmount.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-[#b69a5b]">
          Espace client
        </p>

        <h2 className="mt-3 text-2xl font-semibold">Informations personnelles</h2>

        <p className="mt-4 text-neutral-600">Connecté avec :</p>

        <p className="mt-1 font-medium">{email}</p>
      </div>

      <OrdersList orders={orders} />

      <DevisList orders={orders} />

      <div className="rounded-3xl border bg-white p-8">
        <h3 className="text-xl font-semibold">Paramètres</h3>

        <div className="mt-5">
          <LogoutButton />
        </div>
      </div>
    </section>
  );
}