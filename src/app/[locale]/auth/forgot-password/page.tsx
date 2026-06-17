// src/app/[locale]/auth/forgot-password/page.tsx

import Link from "next/link";

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ForgotPasswordPage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-20">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
            Compte client
          </p>

          <h1 className="text-4xl font-semibold text-neutral-950">
            Mot de passe oublié
          </h1>

          <p className="mt-4 text-sm leading-6 text-neutral-600">
            Entrez votre adresse email. Nous vous enverrons un lien sécurisé
            pour créer un nouveau mot de passe.
          </p>
        </div>

        <ForgotPasswordForm locale={locale} />

        <div className="mt-6 text-center">
          <Link
            href={`/${locale}/auth/login`}
            className="text-sm font-medium text-neutral-700 underline-offset-4 transition hover:text-neutral-950 hover:underline"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </main>
  );
}