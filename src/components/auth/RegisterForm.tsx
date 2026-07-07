"use client";

import { useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

import { register } from "@/actions/auth/register";

type Props = {
  redirectTo?: string;
};

export default function RegisterForm({ redirectTo }: Props) {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "fr";

  const [error, setError] = useState("");
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");

    startTransition(async () => {
      const result = await register(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.confirmEmail) {
        setConfirmEmail(true);
      }
    });
  }

  if (confirmEmail) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-[#d7b86e]/30 bg-black/35 p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f4d98a]/80 to-transparent" />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10">
          <CheckCircle2 className="h-7 w-7 text-emerald-300" />
        </div>
        <h2 className="text-xl font-semibold text-white">Vérifiez votre email</h2>
        <p className="mt-3 text-sm leading-6 text-white/60">
          Un lien de confirmation a été envoyé à votre adresse email. Cliquez
          dessus pour activer votre compte.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      {redirectTo ? (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      ) : null}

      <div className="space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Adresse email"
          required
          autoComplete="email"
          className="w-full rounded-2xl border border-[#d7b86e]/20 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d37b]/60 focus:bg-white/[0.08]"
        />

        <input
          name="password"
          type="password"
          placeholder="Mot de passe (minimum 6 caractères)"
          required
          autoComplete="new-password"
          className="w-full rounded-2xl border border-[#d7b86e]/20 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d37b]/60 focus:bg-white/[0.08]"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmer le mot de passe"
          required
          autoComplete="new-password"
          className="w-full rounded-2xl border border-[#d7b86e]/20 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d37b]/60 focus:bg-white/[0.08]"
        />
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-300/15 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-[#ffe6a3]/35 bg-gradient-to-br from-[#f4d98a] to-[#c9a04e] px-5 py-3.5 text-sm font-semibold text-black shadow-[0_14px_40px_rgba(215,184,110,0.22)] transition hover:-translate-y-0.5 hover:from-[#ffe6a3] hover:to-[#d7b86e] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Création en cours...
          </>
        ) : (
          "Créer mon compte"
        )}
      </button>
    </form>
  );
}
