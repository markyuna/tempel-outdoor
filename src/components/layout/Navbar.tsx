// src/components/layout/Navbar.tsx

import NavbarClient from "@/components/layout/NavbarClient";
import { createClient } from "@/lib/supabase/server";

function isAuthSessionMissingError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AuthSessionMissingError"
  );
}

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && !isAuthSessionMissingError(error)) {
    console.error("Erreur récupération utilisateur navbar:", error);
  }

  return <NavbarClient initialIsAuthenticated={Boolean(user)} />;
}