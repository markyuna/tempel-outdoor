// src/components/auth/LoginForm.tsx

"use client";

import { useState, useTransition } from "react";
import { useParams } from "next/navigation";

import { login } from "@/actions/auth/login";

export default function LoginForm() {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "fr";
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleLogin(formData: FormData) {
    setError("");

    startTransition(async () => {
      const result = await login(formData);

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form action={handleLogin} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        autoFocus
        autoComplete="email"
        className="w-full rounded-xl border p-3 outline-none transition focus:border-black"
      />

      <input
        name="password"
        type="password"
        placeholder="Mot de passe"
        required
        autoComplete="current-password"
        className="w-full rounded-xl border p-3 outline-none transition focus:border-black"
      />

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
      >
        {isPending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}