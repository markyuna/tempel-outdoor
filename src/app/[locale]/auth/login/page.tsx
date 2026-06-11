// src/app/[locale]/auth/login/page.tsx

import Link from "next/link";

import LoginForm from "@/components/auth/LoginForm";

type LoginPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    redirectTo?: string;
  }>;
};

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const redirectTo = resolvedSearchParams?.redirectTo;
  const registerHref = redirectTo
    ? `/${locale}/auth/register?redirectTo=${encodeURIComponent(redirectTo)}`
    : `/${locale}/auth/register`;

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-20">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#b49a5f]">
            Espace client
          </p>

          <h1 className="text-4xl font-semibold text-[#181512]">
            Connexion
          </h1>

          <p className="mt-4 text-sm leading-6 text-neutral-600">
            Connectez-vous pour retrouver vos informations, suivre vos
            commandes et finaliser plus rapidement votre panier.
          </p>
        </div>

        <LoginForm />

        <div className="mt-8 rounded-3xl border border-black/10 bg-white/60 p-6 text-center shadow-sm">
          <p className="text-sm text-neutral-600">
            Pas encore de compte ?
          </p>

          <Link
            href={registerHref}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#181512] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}