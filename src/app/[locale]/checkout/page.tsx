// src/app/[locale]/checkout/page.tsx

import { redirect } from "next/navigation";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CheckoutPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

type CheckoutProfile = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
};

function createCheckoutFormKey(
  userId: string | null,
  profile: CheckoutProfile | null
) {
  if (!profile) {
    return userId ?? "guest-checkout";
  }

  return [
    userId,
    profile.email,
    profile.first_name,
    profile.last_name,
    profile.phone,
    profile.address,
    profile.postal_code,
    profile.city,
    profile.country,
  ]
    .filter(Boolean)
    .join("-");
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Erreur récupération utilisateur checkout:", userError);
  }

  if (!user) {
    redirect(`/${locale}/auth/login?redirectTo=/${locale}/checkout`);
  }

  let profile: CheckoutProfile | null = null;

  if (user?.id) {
    const { data: profileByUserId, error: profileByUserIdError } =
      await supabaseAdmin
        .from("profiles")
        .select(
          "first_name, last_name, email, phone, address, postal_code, city, country"
        )
        .eq("user_id", user.id)
        .maybeSingle();

    if (profileByUserIdError) {
      console.error(
        "Erreur chargement profil checkout par user_id:",
        profileByUserIdError
      );
    }

    profile = profileByUserId;

    if (!profile && user.email) {
      const { data: profileByEmail, error: profileByEmailError } =
        await supabaseAdmin
          .from("profiles")
          .select(
            "first_name, last_name, email, phone, address, postal_code, city, country"
          )
          .eq("email", user.email.toLowerCase())
          .maybeSingle();

      if (profileByEmailError) {
        console.error(
          "Erreur chargement profil checkout par email:",
          profileByEmailError
        );
      }

      profile = profileByEmail;
    }
  }

  const checkoutFormKey = createCheckoutFormKey(user?.id ?? null, profile);

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-28 text-[#181512]">
      <section className="mx-auto max-w-7xl">
        <CheckoutForm
          key={checkoutFormKey}
          locale={locale}
          userId={user?.id ?? null}
          userEmail={user?.email ?? ""}
          profile={profile}
        />
      </section>
    </main>
  );
}