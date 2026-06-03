"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { ProductSpecSection } from "@/types/product";

type Props = {
  productId: string;
  sections?: ProductSpecSection[];
};

export default function ProductSpecsEditor({
  productId,
  sections = [],
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [sectionTitle, setSectionTitle] = useState("");
  const [savingSection, setSavingSection] = useState(false);

  async function handleAddSection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = sectionTitle.trim();

    if (!title) {
      alert("Ajoute un titre de section.");
      return;
    }

    setSavingSection(true);

    const { error } = await supabase.from("product_spec_sections").insert({
      product_id: productId,
      title,
      position: sections.length,
    });

    setSavingSection(false);

    if (error) {
      alert(`Erreur création section: ${error.message}`);
      return;
    }

    setSectionTitle("");
    router.refresh();
  }

  async function handleDeleteSection(sectionId: string) {
    const confirmed = window.confirm(
      "Supprimer cette section et tous ses détails ?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("product_spec_sections")
      .delete()
      .eq("id", sectionId);

    if (error) {
      alert(`Erreur suppression section: ${error.message}`);
      return;
    }

    router.refresh();
  }

  return (
    <section className="rounded-3xl border bg-white p-8">
      <h2 className="text-xl font-semibold">Fiche technique</h2>

      <p className="mt-2 text-sm text-gray-500">
        Ajoute des sections comme Matériaux, Dimensions, Accessoires inclus,
        Livraison, Garantie, etc.
      </p>

      <form onSubmit={handleAddSection} className="mt-8 flex flex-col gap-4">
        <input
          type="text"
          value={sectionTitle}
          onChange={(event) => setSectionTitle(event.target.value)}
          placeholder="Ex: Matériaux"
          className="h-12 rounded-2xl border px-4 outline-none transition focus:border-black"
        />

        <button
          type="submit"
          disabled={savingSection}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {savingSection ? "Création..." : "Ajouter une section"}
        </button>
      </form>

      <div className="mt-10 space-y-6">
        {sections.map((section) => (
          <SpecSectionCard
            key={section.id}
            section={section}
            onDelete={() => handleDeleteSection(section.id)}
          />
        ))}
      </div>
    </section>
  );
}

function SpecSectionCard({
  section,
  onDelete,
}: {
  section: ProductSpecSection;
  onDelete: () => void;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [savingItem, setSavingItem] = useState(false);

  async function handleAddItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanLabel = label.trim();
    const cleanValue = value.trim();

    if (!cleanValue) {
      alert("Ajoute au moins une valeur.");
      return;
    }

    setSavingItem(true);

    const { error } = await supabase.from("product_spec_items").insert({
      section_id: section.id,
      label: cleanLabel || null,
      value: cleanValue,
      position: section.items?.length ?? 0,
    });

    setSavingItem(false);

    if (error) {
      alert(`Erreur ajout détail: ${error.message}`);
      return;
    }

    setLabel("");
    setValue("");
    router.refresh();
  }

  async function handleDeleteItem(itemId: string) {
    const confirmed = window.confirm("Supprimer cette ligne ?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("product_spec_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      alert(`Erreur suppression ligne: ${error.message}`);
      return;
    }

    router.refresh();
  }

  return (
    <article className="rounded-2xl border bg-[#f7f4ee] p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">{section.title}</h3>

        <button
          type="button"
          onClick={onDelete}
          className="rounded-full border bg-white p-2 text-red-600 transition hover:bg-red-50"
          aria-label="Supprimer la section"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {section.items && section.items.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
          {section.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 border-b px-4 py-3 last:border-b-0"
            >
              <div className="text-sm">
                {item.label && (
                  <p className="font-medium text-[#181512]">{item.label}</p>
                )}

                <p className="mt-1 text-gray-600">{item.value}</p>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="rounded-full p-2 text-red-600 transition hover:bg-red-50"
                aria-label="Supprimer la ligne"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleAddItem}
        className="mt-5 grid gap-3 md:grid-cols-[1fr_1.5fr_auto]"
      >
        <input
          type="text"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Label: Poids"
          className="h-11 rounded-2xl border bg-white px-4 text-sm outline-none transition focus:border-black"
        />

        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Valeur: 110 kg"
          className="h-11 rounded-2xl border bg-white px-4 text-sm outline-none transition focus:border-black"
        />

        <button
          type="submit"
          disabled={savingItem}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {savingItem ? "..." : "Ajouter"}
        </button>
      </form>
    </article>
  );
}