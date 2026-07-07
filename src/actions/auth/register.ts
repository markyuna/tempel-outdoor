"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function register(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const locale = String(formData.get("locale") || "fr");
  const redirectTo = String(formData.get("redirectTo") || "");

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  if (password !== confirmPassword) {
    return { error: "Les deux mots de passe ne correspondent pas." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "Un compte existe déjà avec cette adresse email." };
    }
    return { error: "Impossible de créer le compte. Veuillez réessayer." };
  }

  // Email confirmation required — session is null until the user confirms
  if (!data.session) {
    return { confirmEmail: true };
  }

  const destination =
    redirectTo && redirectTo.startsWith("/") ? redirectTo : `/${locale}/mon-compte`;

  redirect(destination);
}
