// src/app/[locale]/mon-compte/page.tsx

import { redirect } from "next/navigation";

import AccountDashboard from "@/components/account/AccountDashboard";
import { createClient } from "@/lib/supabase/server";

export default async function MonComptePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/fr/auth/login");
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      "id, created_at, total, status, devis_number, devis_pdf_url, devis_generated_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Erreur chargement commandes client:", ordersError);
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <h1 className="mb-10 text-4xl font-semibold">Mon compte</h1>

        <AccountDashboard email={user.email ?? ""} orders={orders ?? []} />
      </section>
    </main>
  );
}