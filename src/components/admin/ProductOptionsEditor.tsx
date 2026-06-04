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

function formatOptionValue(label: string, price: string) {
  const cleanLabel = label.trim();
  const cleanPrice = price.trim();

  if (!cleanPrice) return cleanLabel;

  return `${cleanLabel} | ${cleanPrice}`;
}

export default function ProductOptionEditor({
  productId,
  options = [],
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const [required, setRequired] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleAddValue() {
    const cleanLabel = label.trim();

    if (!cleanLabel) {
      alert("Ajoute une dimension ou une valeur.");
      return;
    }

    setValues((currentValues) => [
      ...currentValues,
      formatOptionValue(cleanLabel, price),
    ]);

    setLabel("");
    setPrice("");
  }

  function handleRemoveValue(valueToRemove: string) {
    setValues((currentValues) =>
      currentValues.filter((value) => value !== valueToRemove)
    );
  }

  async function handleAddOption(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName || values.length === 0) {
      alert("Ajoute un nom d’option et au moins une valeur.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("product_options").insert({
      product_id: productId,
      name: cleanName,
      values,
      required,
      position: options.length,
    });

    setSaving(false);

    if (error) {
      alert(`Erreur sauvegarde option: ${error.message}`);
      return;
    }

    setName("");
    setLabel("");
    setPrice("");
    setValues([]);
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
      <div>
        <h2 className="text-xl font-semibold">Options du produit</h2>

        <p className="mt-2 text-sm text-gray-500">
          Ajoute les choix disponibles pour ce produit : dimensions, couleur,
          finition, taille, etc. Pour les dimensions, ajoute aussi le prix.
        </p>
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
            placeholder="Ex: Dimensions"
            className="h-12 w-full rounded-2xl border px-4 outline-none transition focus:border-black"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_180px_auto] md:items-end">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Valeur disponible
            </label>

            <input
              type="text"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Ex: 120 × 185 × 200 cm"
              className="h-12 w-full rounded-2xl border px-4 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Prix</label>

            <input
              type="text"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Ex: 6190"
              className="h-12 w-full rounded-2xl border px-4 outline-none transition focus:border-black"
            />
          </div>

          <button
            type="button"
            onClick={handleAddValue}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        {values.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {values.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRemoveValue(value)}
                className="rounded-full border bg-[#f7f4ee] px-4 py-2 text-sm text-gray-700 transition hover:border-red-300 hover:text-red-600"
              >
                {value}
              </button>
            ))}
          </div>
        )}

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
          {saving ? "Ajout en cours..." : "Ajouter l’option’"}
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