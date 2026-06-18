// src/app/admin/customers/page.tsx

import Link from "next/link";
import { ArrowLeft, Mail, Phone, UserRound } from "lucide-react";

import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Customer = {
  id: string;
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

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getCustomerName(customer: Customer) {
  const fullName = `${customer.first_name || ""} ${
    customer.last_name || ""
  }`.trim();

  return fullName || "Client sans nom";
}

export default async function AdminCustomersPage() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select(
      `
      id,
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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur chargement clients:", error);
  }

  const customers = (data ?? []) as Customer[];

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour dashboard
        </Link>

        <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9c7b4f]">
              Administration
            </p>

            <h1 className="text-3xl font-semibold text-[#181512] md:text-5xl">
              Clients
            </h1>

            <p className="mt-3 max-w-2xl text-neutral-600">
              Consultez les comptes clients créés sur Tempel Outdoor ainsi que
              leurs coordonnées principales.
            </p>
          </div>

          <div className="rounded-3xl bg-white px-6 py-4 shadow-sm">
            <p className="text-sm text-neutral-500">Clients enregistrés</p>
            <p className="mt-1 text-3xl font-semibold text-[#181512]">
              {customers.length}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-sm">
          {!customers.length ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f4ee]">
                <UserRound className="h-7 w-7 text-[#9c7b4f]" />
              </div>

              <h2 className="text-2xl font-semibold text-[#181512]">
                Aucun client pour le moment
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
                Les comptes clients créés depuis le site apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-[#181512] text-white">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Client
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Adresse
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Rôle
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                      Créé le
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/10">
                  {customers.map((customer) => {
                    const postalCity = [
                      customer.postal_code,
                      customer.city,
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <tr
                        key={customer.id}
                        className="transition hover:bg-[#f7f4ee]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f4ee]">
                              <UserRound className="h-5 w-5 text-[#9c7b4f]" />
                            </div>

                            <div>
                              <p className="font-semibold text-[#181512]">
                                {getCustomerName(customer)}
                              </p>

                              <p className="mt-1 font-mono text-xs text-neutral-400">
                                #{customer.id.slice(0, 8).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-2 text-sm text-neutral-600">
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-neutral-400" />
                              {customer.email || "—"}
                            </p>

                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-neutral-400" />
                              {customer.phone || "—"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="max-w-[260px] rounded-2xl bg-[#f7f4ee] p-4 text-sm leading-6 text-neutral-600">
                            <p>{customer.address || "Adresse non renseignée"}</p>
                            <p>{postalCity || "—"}</p>
                            <p>{customer.country || "—"}</p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-[#f7f4ee] px-3 py-1 text-xs font-semibold text-[#181512]">
                            {customer.role || "customer"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-neutral-500">
                          {formatDate(customer.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}