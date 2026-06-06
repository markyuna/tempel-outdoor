import Link from "next/link";
import { Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type Realisation = {
  id: string;
  title: string;
  slug: string;
  category: string;
  city: string | null;
  status: string;
  is_featured: boolean | null;
  position: number | null;
};

export default async function AdminRealisationsPage() {
  const supabase = await createClient();

  const { data: realisations, error } = await supabase
    .from("realisations")
    .select("id, title, slug, category, city, status, is_featured, position")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur chargement réalisations:", error);
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-12 text-black">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-black/50">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              Réalisations
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-black/60">
              Ajoute ici les installations clients pour renforcer la crédibilité
              premium du site Tempel Outdoor.
            </p>
          </div>

          <Link
            href="/admin/realisations/create"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80"
          >
            <Plus size={18} />
            Nouvelle réalisation
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-5 py-4 font-medium">Titre</th>
                <th className="px-5 py-4 font-medium">Catégorie</th>
                <th className="px-5 py-4 font-medium">Ville</th>
                <th className="px-5 py-4 font-medium">Statut</th>
                <th className="px-5 py-4 font-medium">Mise en avant</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {(realisations ?? []).map((realisation) => (
                <tr
                  key={realisation.id}
                  className="border-t border-black/10 transition hover:bg-[#f7f4ee]"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium">{realisation.title}</div>
                    <div className="text-xs text-black/50">
                      /{realisation.slug}
                    </div>
                  </td>

                  <td className="px-5 py-4 capitalize">
                    {realisation.category}
                  </td>

                  <td className="px-5 py-4">
                    {realisation.city || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-black/5 px-3 py-1 text-xs capitalize">
                      {realisation.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {realisation.is_featured ? "Oui" : "Non"}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/realisations/${realisation.id}/edit`}
                      className="rounded-full border border-black/10 px-4 py-2 text-xs font-medium transition hover:bg-black hover:text-white"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}

              {(!realisations || realisations.length === 0) && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-black/50"
                  >
                    Aucune réalisation pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}