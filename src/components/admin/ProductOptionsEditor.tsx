"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { ProductOption } from "@/types/product";

type Props = {
  productId: string;
  options?: ProductOption[];
};

export default function ProductOptionEditor({
  productId,
  options = [],
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [values, setValues] = useState("");
  const [required, setRequired] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleAddOption(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanValues = values
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!cleanName || cleanValues.length === 0) {
      alert("Ajoute un nom d’option et au moins une valeur.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("product_options").insert({
      product_id: productId,
      name: cleanName,
      values: cleanValues,
      required,
      position: options.length,
    });

    setSaving(false);

    if (error) {
      alert(`Erreur sauvegarde option: ${error.message}`);
      return;
    }

    setName("");
    setValues("");
    setRequired(false);
    router.refresh();
  }

  async function handleDeleteOption(optionId: string) {
    const confirmed = window.confirm("Supprimer cette option ?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("product_options")
      .delete()
      .eq("id", optionId);

    if (error) {
      alert(`Erreur suppression option: ${error.message}`);
      return;
    }

    router.refresh();
  }

  return (
    <section className="rounded-3xl border bg-white p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-xl font-semibold">Options du produit</h2>

          <p className="mt-2 text-sm text-gray-500">
            Ajoute les choix disponibles pour ce produit : couleur, plateau,
            tapis, finition, taille, etc.
          </p>
        </div>
      </div>

      <form onSubmit={handleAddOption} className="mt-8 grid gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Nom de l’option
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex: Coloris du tapis"
            className="h-12 w-full rounded-2xl border px-4 outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Valeurs disponibles
          </label>

          <input
            type="text"
            value={values}
            onChange={(event) => setValues(event.target.value)}
            placeholder="Ex: Gris foncé, Bleu, Rouge"
            className="h-12 w-full rounded-2xl border px-4 outline-none transition focus:border-black"
          />

          <p className="mt-2 text-xs text-gray-500">
            Sépare chaque valeur par une virgule.
          </p>
        </div>

        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={required}
            onChange={(event) => setRequired(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />

          Option obligatoire
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {saving ? "Ajout en cours..." : "Ajouter l’option"}
        </button>
      </form>

      {options.length > 0 && (
        <div className="mt-10 space-y-4">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-start justify-between gap-6 rounded-2xl border bg-[#f7f4ee] p-5"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-semibold">{option.name}</h3>

                  {option.required && (
                    <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                      Obligatoire
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <span
                      key={value}
                      className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteOption(option.id)}
                className="rounded-full border p-2 text-red-600 transition hover:bg-red-50"
                aria-label="Supprimer l’option"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}