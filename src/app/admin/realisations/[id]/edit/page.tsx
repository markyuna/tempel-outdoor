import Link from "next/link";
import { notFound } from "next/navigation";

import RealisationForm from "@/components/admin/RealisationForm";
import RealisationMediaUploader from "@/components/admin/RealisationMediaUploader";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditRealisationPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: realisation, error } = await supabase
    .from("realisations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !realisation) {
    notFound();
  }

  const { data: media } = await supabase
    .from("realisation_media")
    .select("*")
    .eq("realisation_id", id)
    .order("position", { ascending: true });

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-12 text-black">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/realisations"
          className="mb-8 inline-block text-sm text-black/60 transition hover:text-black"
        >
          ← Retour aux réalisations
        </Link>

        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-black/45">
            Admin
          </p>
          <h1 className="mt-2 text-4xl font-semibold">
            Modifier la réalisation
          </h1>
        </div>

        <div className="grid gap-8">
          <RealisationForm realisation={realisation} />

          <RealisationMediaUploader
            realisationId={realisation.id}
            realisationTitle={realisation.title}
            realisationCategory={realisation.category}
            realisationCity={realisation.city}
            media={media ?? []}
          />
        </div>
      </div>
    </main>
  );
}