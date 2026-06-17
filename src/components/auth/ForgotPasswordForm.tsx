// src/components/auth/ForgotPasswordForm.tsx

"use client";

import { FormEvent, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type ForgotPasswordFormProps = {
  locale: string;
};

export default function ForgotPasswordForm({ locale }: ForgotPasswordFormProps) {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage("Veuillez renseigner votre adresse email.");
      setIsSubmitting(false);
      return;
    }

    const redirectTo = `${window.location.origin}/${locale}/auth/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo,
      }
    );

    if (error) {
      console.error("Erreur reset password:", error);

      setErrorMessage(
        "Impossible d'envoyer l'email de réinitialisation. Veuillez réessayer."
      );
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage(
      "Si un compte existe avec cette adresse email, un lien de réinitialisation vient d'être envoyé."
    );

    setEmail("");
    setIsSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label
          htmlFor="forgot-password-email"
          className="text-sm font-medium text-neutral-800"
        >
          Adresse email
        </label>

        <input
          id="forgot-password-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="votre@email.com"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
        />
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer le lien"}
      </button>
    </form>
  );
}