"use client";

import { logout } from "@/actions/auth/logout";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white/70 transition hover:border-white/40 hover:text-white"
      >
        Déconnexion
      </button>
    </form>
  );
}