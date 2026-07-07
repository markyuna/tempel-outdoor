import Link from "next/link";

import RegisterForm from "@/components/auth/RegisterForm";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ redirectTo?: string }>;
};

export default async function RegisterPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const redirectTo = resolvedSearchParams?.redirectTo;

  const loginHref = redirectTo
    ? `/${locale}/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`
    : `/${locale}/auth/login`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080806] px-6 py-20 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,184,110,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_32%),linear-gradient(135deg,rgba(8,8,6,1),rgba(24,21,18,0.96),rgba(8,8,6,1))]" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[#d7b86e]/20 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-[#b8913f]/20 blur-[110px]" />
      <div className="pointer-events-none absolute -right-28 top-1/3 h-96 w-96 rounded-full bg-white/10 blur-[130px]" />

      <div className="relative mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-full border border-[#d7b86e]/30 bg-white/[0.055] px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f6df9c]">
              Espace client
            </p>
          </div>

          <h1 className="bg-gradient-to-br from-white via-[#f6df9c] to-[#b8913f] bg-clip-text text-4xl font-semibold tracking-tight text-transparent">
            Créer un compte
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/65">
            Suivez vos commandes, accédez à vos devis et finalisez votre panier
            plus rapidement.
          </p>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border border-[#d7b86e]/30 bg-black/35 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.48),0_0_55px_rgba(215,184,110,0.14)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,184,110,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.07),transparent_35%)]" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f4d98a]/80 to-transparent" />

          <div className="relative">
            <RegisterForm redirectTo={redirectTo} />
          </div>
        </section>

        <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 text-center shadow-[0_18px_60px_rgba(0,0,0,0.26)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#d7b86e]/12 via-transparent to-white/5" />

          <div className="relative">
            <p className="text-sm text-white/65">Déjà un compte ?</p>

            <Link
              href={loginHref}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.08] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.13]"
            >
              Se connecter
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-white/35">
          Tempel Outdoor · Spa, sauna & loisirs haut de gamme
        </p>
      </div>
    </main>
  );
}
