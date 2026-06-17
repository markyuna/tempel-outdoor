// src/components/account/AccountDashboard.tsx

import Link from "next/link";

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

type Profile = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
} | null;

type Props = {
  locale: string;
  email: string;
  profile: Profile;
  orders: Order[];
};

export default function AccountDashboard({
  locale,
  email,
  profile,
  orders,
}: Props) {
  const devisCount = orders.filter((order) => order.devis_pdf_url).length;

  const totalAmount = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    email;

  const address = [
    profile?.address,
    profile?.postal_code,
    profile?.city,
    profile?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-black/10 bg-[#181512] p-8 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.25em] text-[#d8bd7a]">
          Espace client
        </p>

        <h2 className="mt-4 text-3xl font-semibold">Bonjour, {displayName}</h2>

        <p className="mt-3 max-w-2xl text-white/70">
          Retrouvez ici vos commandes, vos devis disponibles et vos informations
          de livraison.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-500">Commandes</p>
          <p className="mt-2 text-3xl font-semibold text-[#181512]">
            {orders.length}
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-500">Devis disponibles</p>
          <p className="mt-2 text-3xl font-semibold text-[#181512]">
            {devisCount}
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-500">Total commandes</p>
          <p className="mt-2 text-3xl font-semibold text-[#181512]">
            {totalAmount.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#b69a5b]">
              Informations personnelles
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-[#181512]">
              Vos coordonnées
            </h2>
          </div>

          <Link
            href={`/${locale}/mon-compte/informations`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-[#181512] transition hover:bg-[#f7f4ee]"
          >
            Modifier mes informations
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <InfoItem label="Email" value={profile?.email || email} />
          <InfoItem label="Téléphone" value={profile?.phone} />
          <InfoItem label="Nom" value={displayName} />
          <InfoItem label="Adresse" value={address} />
        </div>
      </div>

      <OrdersList locale={locale} orders={orders} />

      <DevisList orders={orders} />

      <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-[#181512]">Paramètres</h3>

        <div className="mt-5">
          <LogoutButton />
        </div>
      </div>
    </section>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl bg-[#f7f4ee] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </p>

      <p className="mt-2 font-medium text-[#181512]">
        {value || "Non renseigné"}
      </p>
    </div>
  );
}