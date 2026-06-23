"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function register(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const locale = String(formData.get("locale") || "fr");

  if (!email || !password) {
    return {
      error: "Veuillez remplir tous les champs.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  redirect(`/${locale}/mon-compte`);
}