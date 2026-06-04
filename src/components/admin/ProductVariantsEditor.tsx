"use client";

import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type ProductMedia = {
  id: string;
  url: string;
  alt: string | null;
  type: "image" | "video";
  position: number | null;
};

type ProductVariant = {
  id: string;
  product_id: string;
  name: string;
  value: string;
  image_media_id: string | null;
  position: number | null;
};

type Props = {
  productId: string;
  media: ProductMedia[];
  variants: ProductVariant[];
};

const DEFAULT_VARIANTS = [
  { label: "Terracotta", value: "terracotta" },
  { label: "Moutarde", value: "moutarde" },
  { label: "Bleu d'eau", value: "bleu-eau" },
  { label: "Blanc", value: "blanc" },
  { label: "Noir", value: "noir" },
];

export default function ProductVariantsEditor({
  productId,
  media,
  variants,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const imageMedia = media.filter((item) => item.type === "image");

  async function createDefaultVariants() {
    setLoading(true);

    try {
      const existingValues = new Set(variants.map((variant) => variant.value));

      const variantsToCreate = DEFAULT_VARIANTS.filter(
        (variant) => !existingValues.has(variant.value)
      ).map((variant, index) => ({
        product_id: productId,
        name: "receptacle_color",
        value: variant.value,
        image_media_id: null,
        position: variants.length + index,
      }));

      if (variantsToCreate.length === 0) {
        alert("Les variantes existent déjà.");
        return;
      }

      const { error } = await supabase
        .from("product_variants")
        .insert(variantsToCreate);

      if (error) throw new Error(error.message);

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Erreur pendant la création des variantes."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateVariantImage(variantId: string, imageMediaId: string) {
    setLoading(true);

    try {
      const { error } = await supabase
        .from("product_variants")
        .update({
          image_media_id: imageMediaId || null,
        })
        .eq("id", variantId);

      if (error) throw new Error(error.message);

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Erreur pendant la mise à jour de la variante."
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteVariant(variantId: string) {
    const confirmed = window.confirm("Supprimer cette variante ?");

    if (!confirmed) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("product_variants")
        .delete()
        .eq("id", variantId);

      if (error) throw new Error(error.message);

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Erreur pendant la suppression de la variante."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Variantes couleur</h2>
          <p className="mt-2 text-sm text-[#5f5a54]">
            Associe chaque couleur à l’image correspondante du produit.
          </p>
        </div>

        <button
          type="button"
          onClick={createDefaultVariants}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c76b2a] disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Ajouter couleurs
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed bg-[#f7f4ee] p-6 text-sm text-[#8a8178]">
          Aucune variante pour le moment. Clique sur “Ajouter couleurs”.
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {variants.map((variant) => {
            const selectedMedia = imageMedia.find(
              (item) => item.id === variant.image_media_id
            );

            return (
              <div
                key={variant.id}
                className="grid gap-4 rounded-2xl border bg-[#f7f4ee] p-4 md:grid-cols-[180px_1fr_auto] md:items-center"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c76b2a]">
                    {variant.name}
                  </p>
                  <p className="mt-1 text-base font-semibold capitalize">
                    {variant.value.replace("-", " ")}
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-[96px_1fr] md:items-center">
                  <div className="relative h-24 overflow-hidden rounded-xl border bg-white">
                    {selectedMedia ? (
                      <Image
                        src={selectedMedia.url}
                        alt={selectedMedia.alt || variant.value}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                        Sans image
                      </div>
                    )}
                  </div>

                  <select
                    value={variant.image_media_id ?? ""}
                    onChange={(event) =>
                      updateVariantImage(variant.id, event.target.value)
                    }
                    disabled={loading || imageMedia.length === 0}
                    className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  >
                    <option value="">Choisir une image</option>

                    {imageMedia.map((item, index) => (
                      <option key={item.id} value={item.id}>
                        Image {index + 1} — {item.alt || item.id}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => deleteVariant(variant.id)}
                  disabled={loading}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  aria-label="Supprimer la variante"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}