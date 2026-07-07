// src/app/[locale]/mon-compte/informations/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { revalidatePath } from "next/cache";

import ProfileForm from "@/components/account/ProfileForm";
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

type ActionState = {
  success: boolean;
  message: string;
};

export default async function AccountInformationsPage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/${locale}/auth/login`);
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select(
      "first_name, last_name, email, phone, address, postal_code, city, country"
    )
    .eq("user_id", user.id)
    .maybeSingle<Profile>();

  if (profileError) {
    console.warn(
      "Profil client non chargé:",
      profileError.message || profileError
    );
  }

  async function updateProfile(
    _previousState: ActionState,
    formData: FormData
  ): Promise<ActionState> {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message: "Vous devez être connecté pour modifier vos informations.",
      };
    }

    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const postalCode = String(formData.get("postalCode") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const country = String(formData.get("country") || "France").trim();

    if (!firstName || !lastName || !email || !phone) {
      return {
        success: false,
        message:
          "Merci de compléter au minimum votre prénom, nom, email et téléphone.",
      };
    }

    const profilePayload = {
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address: address || null,
      postal_code: postalCode || null,
      city: city || null,
      country: country || "France",
      updated_at: new Date().toISOString(),
    };

    const { data: existingProfile, error: existingProfileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (existingProfileError) {
      console.error(
        "Erreur recherche profil client:",
        existingProfileError.message || existingProfileError
      );

      return {
        success: false,
        message:
          existingProfileError.message ||
          "Impossible de vérifier votre profil client.",
      };
    }

    if (existingProfile?.id) {
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update(profilePayload)
        .eq("user_id", user.id);

      if (updateError) {
        console.error(
          "Erreur mise à jour profil client:",
          updateError.message || updateError
        );

        return {
          success: false,
          message:
            updateError.message ||
            "Impossible de mettre à jour vos informations.",
        };
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("profiles")
        .insert(profilePayload);

      if (insertError) {
        console.error(
          "Erreur création profil client:",
          insertError.message || insertError
        );

        return {
          success: false,
          message:
            insertError.message ||
            "Impossible de créer votre profil client.",
        };
      }
    }

    revalidatePath(`/${locale}/mon-compte`);
    revalidatePath(`/${locale}/mon-compte/informations`);
    revalidatePath(`/${locale}/checkout`);

    return {
      success: true,
      message: "Vos informations ont bien été mises à jour.",
    };
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-20 text-[#181512]">
      <section className="mx-auto max-w-4xl">
        <Link
          href={`/${locale}/mon-compte`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à mon compte
        </Link>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#9c7b4f]">
            Espace client
          </p>

          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Mes informations
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Ces informations seront utilisées automatiquement lors de vos
            prochaines demandes de commande ou de devis.
          </p>

          <ProfileForm
            profile={profile}
            userEmail={user.email ?? ""}
            updateProfile={updateProfile}
          />
        </div>
      </section>
    </main>
  );
}