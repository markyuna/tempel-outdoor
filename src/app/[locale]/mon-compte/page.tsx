// src/app/[locale]/mon-compte/page.tsx

import { redirect } from "next/navigation";

import AccountDashboard from "@/components/account/AccountDashboard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    locale: string;
  }>;
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

export default async function MonComptePage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/${locale}/auth/login`);
  }

  let profile: Profile = null;

  const { data: profileData, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select(
      "first_name, last_name, email, phone, address, postal_code, city, country"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    console.warn(
      "Profil client non chargé:",
      profileError.message || profileError
    );
  } else {
    profile = profileData;
  }

  const { data: orders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select(
      "id, created_at, total, status, devis_number, devis_pdf_url, devis_generated_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error(
      "Erreur chargement commandes client:",
      ordersError.message || ordersError
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-28">
      <section className="mx-auto max-w-6xl">
        <h1 className="mb-10 text-4xl font-semibold text-[#181512]">
          Mon compte
        </h1>

        <AccountDashboard
          locale={locale}
          email={user.email ?? ""}
          profile={profile}
          orders={orders ?? []}
        />
      </section>
    </main>
  );
}