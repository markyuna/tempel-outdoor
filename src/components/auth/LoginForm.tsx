"use client";

import { useState } from "react";

import { login } from "@/actions/auth/login";

export default function LoginForm() {
  const [error, setError] = useState("");

  return (
    <form
      action={async (formData) => {
        const result = await login(formData);

        if (result?.error) {
          setError(result.error);
        }
      }}
      className="space-y-4"
    >
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
        Se connecter
      </button>
    </form>
  );
}