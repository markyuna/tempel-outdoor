"use client";

import { logout } from "@/actions/auth/logout";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-xl border px-4 py-2"
      >
        Déconnexion
      </button>
    </form>
  );
}