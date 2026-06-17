// src/components/auth/UpdatePasswordForm.tsx

"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordForm() {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "fr";

  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      setHasRecoverySession(Boolean(session));
      setIsCheckingSession(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasRecoverySession(true);
        setIsCheckingSession(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
      setIsSubmitting(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage("Les deux mots de passe ne correspondent pas.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error("Erreur update password:", error);

      setErrorMessage(
        "Impossible de modifier le mot de passe. Le lien a peut-être expiré."
      );
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage(
      "Votre mot de passe a bien été modifié. Vous pouvez maintenant vous connecter."
    );

    setPassword("");
    setPasswordConfirmation("");
    setIsSubmitting(false);
  }

  if (isCheckingSession) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-neutral-600">
          Vérification du lien sécurisé...
        </p>
      </div>
    );
  }

  if (!hasRecoverySession) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white p-6 text-center shadow-sm">
        <p className="text-sm leading-6 text-neutral-600">
          Ce lien de réinitialisation est invalide ou a expiré.
        </p>

        <Link
          href={`/${locale}/auth/forgot-password`}
          className="mt-6 inline-flex rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label
          htmlFor="new-password"
          className="text-sm font-medium text-neutral-800"
        >
          Nouveau mot de passe
        </label>

        <input
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 6 caractères"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
        />
      </div>

      <div className="mt-4 space-y-2">
        <label
          htmlFor="new-password-confirmation"
          className="text-sm font-medium text-neutral-800"
        >
          Confirmer le mot de passe
        </label>

        <input
          id="new-password-confirmation"
          name="passwordConfirmation"
          type="password"
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={(event) => setPasswordConfirmation(event.target.value)}
          placeholder="Confirmez votre mot de passe"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
        />
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <p>{successMessage}</p>

          <Link
            href={`/${locale}/auth/login`}
            className="mt-3 inline-flex font-semibold underline underline-offset-4"
          >
            Aller à la connexion
          </Link>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Modification en cours..." : "Modifier le mot de passe"}
      </button>
    </form>
  );
}