// src/app/[locale]/checkout/page.tsx

import CheckoutForm from "@/components/checkout/CheckoutForm";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user?.id) {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "first_name, last_name, email, phone, address, postal_code, city, country"
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Erreur chargement profil checkout:", error);
    }

    profile = data;
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-28 text-[#181512]">
      <section className="mx-auto max-w-7xl">
        <CheckoutForm
          locale={locale}
          userId={user?.id ?? null}
          userEmail={user?.email ?? ""}
          profile={profile}
        />
      </section>
    </main>
  );
}