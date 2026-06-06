"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type Realisation = {
  id: string;
  title: string;
  slug: string;
  category: string;
  city: string | null;
  description: string | null;
  client_quote: string | null;
  is_featured: boolean | null;
  status: string | null;
  position: number | null;
};

type Props = {
  realisation?: Realisation;
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function RealisationForm({ realisation }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const isEditing = Boolean(realisation);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData(event.currentTarget);

      const title = String(formData.get("title") || "").trim();
      const city = String(formData.get("city") || "").trim();
      const category = String(formData.get("category") || "").trim();
      const description = String(formData.get("description") || "").trim();
      const clientQuote = String(formData.get("clientQuote") || "").trim();
      const status = String(formData.get("status") || "active");
      const isFeatured = formData.get("isFeatured") === "on";
      const position = Number(formData.get("position") || 0);
      const slug = generateSlug(title);

      if (!title || !category) {
        alert("Le titre et la catégorie sont obligatoires.");
        return;
      }

      const payload = {
        title,
        slug,
        city,
        category,
        description,
        client_quote: clientQuote,
        status,
        is_featured: isFeatured,
        position,
        updated_at: new Date().toISOString(),
      };

      if (isEditing && realisation) {
        const { error } = await supabase
          .from("realisations")
          .update(payload)
          .eq("id", realisation.id);

        if (error) throw error;

        router.refresh();
        alert("Réalisation mise à jour.");
        return;
      }

      const { error } = await supabase.from("realisations").insert({
        ...payload,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      router.push("/admin/realisations");
      router.refresh();
    } catch (error) {
      console.error("Erreur formulaire réalisation:", error);
      alert(
        isEditing
          ? "Erreur lors de la mise à jour."
          : "Erreur lors de la création."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm"
    >
      <div className="mb-8">
        <h2 className="text-xl font-semibold">
          {isEditing ? "Informations du projet" : "Nouvelle réalisation"}
        </h2>
        <p className="mt-2 text-sm text-black/50">
          Ces informations seront visibles sur la page publique des
          réalisations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Titre du projet
          </label>

          <input
            name="title"
            required
            defaultValue={realisation?.title ?? ""}
            placeholder="Spa 6 places installé à Deauville"
            className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Ville</label>

          <input
            name="city"
            defaultValue={realisation?.city ?? ""}
            placeholder="Deauville"
            className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Catégorie</label>

          <select
            name="category"
            required
            defaultValue={realisation?.category ?? ""}
            className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black"
          >
            <option value="">Choisir</option>
            <option value="spa">Spa</option>
            <option value="sauna">Sauna</option>
            <option value="billard">Billard</option>
            <option value="baby-foot">Baby-foot</option>
            <option value="fitness">Fitness</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Statut</label>

          <select
            name="status"
            defaultValue={realisation?.status ?? "active"}
            className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black"
          >
            <option value="active">Actif</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Témoignage client
          </label>

          <input
            name="clientQuote"
            defaultValue={realisation?.client_quote ?? ""}
            placeholder="Installation parfaite, produit exceptionnel."
            className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Position d&apos;affichage
          </label>

          <input
            type="number"
            name="position"
            defaultValue={realisation?.position ?? 0}
            className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">
          Description du projet
        </label>

        <textarea
          name="description"
          rows={8}
          defaultValue={realisation?.description ?? ""}
          placeholder="Décrivez le projet réalisé..."
          className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black"
        />
      </div>

      <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 text-sm">
        <input
          type="checkbox"
          name="isFeatured"
          defaultChecked={Boolean(realisation?.is_featured)}
          className="h-4 w-4"
        />
        Mettre cette réalisation en avant
      </label>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-50"
        >
          {loading
            ? isEditing
              ? "Mise à jour..."
              : "Création..."
            : isEditing
              ? "Enregistrer les modifications"
              : "Créer la réalisation"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/realisations")}
          className="rounded-full border border-black/10 px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
        >
          Retour
        </button>
      </div>
    </form>
  );
}