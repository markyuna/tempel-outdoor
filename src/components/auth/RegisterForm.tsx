"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { register } from "@/actions/auth/register";

export default function RegisterForm() {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "fr";
  const [error, setError] = useState("");

  return (
    <form
      action={async (formData) => {
        const result = await register(formData);

        if (result?.error) {
          setError(result.error);
        }
      }}
      className="space-y-4"
    >
      <input type="hidden" name="locale" value={locale} />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full rounded-xl border p-3"
      />

      <input
        name="password"
        type="password"
        placeholder="Mot de passe"
        required
        className="w-full rounded-xl border p-3"
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-black px-6 py-3 text-white"
      >
        Créer un compte
      </button>
    </form>
  );
}