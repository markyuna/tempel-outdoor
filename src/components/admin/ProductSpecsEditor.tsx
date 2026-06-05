// src/components/admin/ProductSpecsEditor.tsx

"use client";

import { Copy, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { ProductSpecSection } from "@/types/product";

type Props = {
  productId: string;
  sections?: ProductSpecSection[];
};

type SpecItem = {
  id: string;
  label: string | null;
  value: string;
  position: number | null;
};

type SpecSectionWithItems = ProductSpecSection & {
  items?: SpecItem[] | null;
  product_spec_items?: SpecItem[] | null;
};

type SourceProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  product_spec_sections:
    | {
        id: string;
        title: string;
        position: number | null;
        product_spec_items: SpecItem[] | null;
      }[]
    | null;
};

const DEFAULT_SECTION_TITLE = "Fiche technique";

function getSectionItems(section: SpecSectionWithItems | null) {
  return section?.items ?? section?.product_spec_items ?? [];
}

export default function ProductSpecsEditor({
  productId,
  sections = [],
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [sourceProducts, setSourceProducts] = useState<SourceProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [copyingSpecs, setCopyingSpecs] = useState(false);

  const defaultSection = useMemo(() => {
    return (
      sections.find(
        (section) =>
          section.title.toLowerCase().trim() ===
          DEFAULT_SECTION_TITLE.toLowerCase()
      ) ??
      sections[0] ??
      null
    );
  }, [sections]);

  useEffect(() => {
    async function loadSourceProducts() {
      setLoadingProducts(true);

      const { data, error } = await supabase
        .from("products")
        .select(
          `
          id,
          name,
          slug,
          category,
          product_spec_sections (
            id,
            title,
            position,
            product_spec_items (
              id,
              label,
              value,
              position
            )
          )
        `
        )
        .neq("id", productId)
        .order("created_at", { ascending: false });

      setLoadingProducts(false);

      if (error) {
        console.error("Erreur chargement produits:", error.message);
        return;
      }

      setSourceProducts((data ?? []) as SourceProduct[]);
    }

    loadSourceProducts();
  }, [productId, supabase]);

  async function getOrCreateDefaultSection() {
    if (defaultSection?.id) {
      return defaultSection.id;
    }

    const { data, error } = await supabase
      .from("product_spec_sections")
      .insert({
        product_id: productId,
        title: DEFAULT_SECTION_TITLE,
        position: 0,
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Impossible de créer la fiche technique");
    }

    return data.id as string;
  }

  async function handleCopySpecs() {
    if (!selectedProductId) {
      alert("Sélectionne un produit à copier.");
      return;
    }

    const sourceProduct = sourceProducts.find(
      (product) => product.id === selectedProductId
    );

    if (!sourceProduct) {
      alert("Produit source introuvable.");
      return;
    }

    const sourceItems = [...(sourceProduct.product_spec_sections ?? [])]
      .sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
      .flatMap((section) =>
        [...(section.product_spec_items ?? [])].sort(
          (a, b) => (a.position ?? 999) - (b.position ?? 999)
        )
      )
      .filter((item) => item.value.trim().length > 0);

    if (sourceItems.length === 0) {
      alert("Ce produit n’a aucune fiche technique à copier.");
      return;
    }

    const currentItems = getSectionItems(defaultSection as SpecSectionWithItems);

    if (currentItems.length > 0) {
      const confirmed = window.confirm(
        "Ce produit possède déjà des spécifications. Voulez-vous les remplacer par celles du produit sélectionné ?"
      );

      if (!confirmed) return;
    }

    setCopyingSpecs(true);

    try {
      const targetSectionId = await getOrCreateDefaultSection();

      if (currentItems.length > 0) {
        const { error: deleteError } = await supabase
          .from("product_spec_items")
          .delete()
          .eq("section_id", targetSectionId);

        if (deleteError) {
          alert(`Erreur suppression anciennes spécifications: ${deleteError.message}`);
          return;
        }
      }

      const itemsToInsert = sourceItems.map((item, index) => ({
        section_id: targetSectionId,
        label: item.label,
        value: item.value,
        position: index,
      }));

      const { error: insertError } = await supabase
        .from("product_spec_items")
        .insert(itemsToInsert);

      if (insertError) {
        alert(`Erreur copie fiche technique: ${insertError.message}`);
        return;
      }

      setSelectedProductId("");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur inconnue.");
    } finally {
      setCopyingSpecs(false);
    }
  }

  return (
    <section className="rounded-3xl border bg-white p-8">
      <h2 className="text-xl font-semibold">Fiche technique</h2>

      <p className="mt-2 text-sm text-gray-500">
        Ajoute uniquement les spécifications du produit : matériaux, dimensions,
        poids, garantie, livraison, accessoires inclus, etc.
      </p>

      <div className="mt-8 rounded-2xl border bg-[#f7f4ee] p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          Copier depuis un produit existant
        </h3>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <select
            value={selectedProductId}
            onChange={(event) => setSelectedProductId(event.target.value)}
            disabled={loadingProducts || copyingSpecs}
            className="h-11 rounded-2xl border bg-white px-4 text-sm outline-none transition focus:border-black disabled:opacity-60"
          >
            <option value="">
              {loadingProducts
                ? "Chargement des produits..."
                : "Sélectionner un produit..."}
            </option>

            {sourceProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} — {product.category}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleCopySpecs}
            disabled={!selectedProductId || copyingSpecs}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Copy className="h-4 w-4" />
            {copyingSpecs ? "Copie..." : "Copier"}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <SpecSectionCard
          productId={productId}
          section={defaultSection as SpecSectionWithItems | null}
        />
      </div>
    </section>
  );
}

function SpecSectionCard({
  productId,
  section,
}: {
  productId: string;
  section: SpecSectionWithItems | null;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [savingItem, setSavingItem] = useState(false);

  const items = getSectionItems(section);

  async function getOrCreateDefaultSection() {
    if (section?.id) {
      return section.id;
    }

    const { data, error } = await supabase
      .from("product_spec_sections")
      .insert({
        product_id: productId,
        title: DEFAULT_SECTION_TITLE,
        position: 0,
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Impossible de créer la fiche technique");
    }

    return data.id as string;
  }

  async function handleAddItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanLabel = label.trim();
    const cleanValue = value.trim();

    if (!cleanLabel) {
      alert("Ajoute un label.");
      return;
    }

    if (!cleanValue) {
      alert("Ajoute une valeur.");
      return;
    }

    setSavingItem(true);

    try {
      const sectionId = await getOrCreateDefaultSection();

      const { error } = await supabase.from("product_spec_items").insert({
        section_id: sectionId,
        label: cleanLabel,
        value: cleanValue,
        position: items.length,
      });

      if (error) {
        alert(`Erreur ajout spécification: ${error.message}`);
        return;
      }

      setLabel("");
      setValue("");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur inconnue.");
    } finally {
      setSavingItem(false);
    }
  }

  async function handleDeleteItem(itemId: string) {
    const confirmed = window.confirm("Supprimer cette spécification ?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("product_spec_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      alert(`Erreur suppression spécification: ${error.message}`);
      return;
    }

    router.refresh();
  }

  return (
    <article className="rounded-2xl border bg-[#f7f4ee] p-5">
      <h3 className="text-lg font-semibold">Spécifications techniques</h3>

      {items.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 border-b px-4 py-3 last:border-b-0"
            >
              <div className="text-sm">
                {item.label ? (
                  <p className="font-medium uppercase tracking-wide text-[#181512]">
                    {item.label}
                  </p>
                ) : null}

                <p className="mt-1 text-gray-600">{item.value}</p>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="rounded-full p-2 text-red-600 transition hover:bg-red-50"
                aria-label="Supprimer la spécification"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed bg-white p-5 text-sm text-gray-500">
          Aucune spécification ajoutée pour le moment.
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
          className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {savingItem ? "Ajout..." : "Ajouter"}
        </button>
      </form>
    </article>
  );
}