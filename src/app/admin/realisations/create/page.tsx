import Link from "next/link";

import RealisationForm from "@/components/admin/RealisationForm";

export default function CreateRealisationPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/realisations"
          className="mb-8 inline-block text-sm text-black/60 hover:text-black"
        >
          ← Retour aux réalisations
        </Link>

        <h1 className="mb-8 text-4xl font-semibold">
          Nouvelle réalisation
        </h1>

        <RealisationForm />
      </div>
    </main>
  );
}