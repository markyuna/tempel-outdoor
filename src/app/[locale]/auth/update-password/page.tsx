// src/app/[locale]/auth/update-password/page.tsx

import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-20">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
            Compte client
          </p>

          <h1 className="text-4xl font-semibold text-neutral-950">
            Nouveau mot de passe
          </h1>

          <p className="mt-4 text-sm leading-6 text-neutral-600">
            Choisissez un nouveau mot de passe pour sécuriser votre compte.
          </p>
        </div>

        <UpdatePasswordForm />
      </div>
    </main>
  );
}