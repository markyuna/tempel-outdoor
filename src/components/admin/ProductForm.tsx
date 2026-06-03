// src/components/admin/ProductForm.tsx

"use client";

import { ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

const categoriesByUniverse = {
  loisirs: [
    { label: "Baby-foot", value: "baby-foot" },
    { label: "Billard", value: "billard" },
  ],
  "bien-etre": [
    { label: "Spa", value: "spa" },
    { label: "Sauna", value: "sauna" },
  ],
  fitness: [{ label: "Fitness Premium", value: "fitness" }],
};

type Universe = keyof typeof categoriesByUniverse;

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function ProductForm() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | "">("");

  async function uploadProductImages(productId: string, files: File[]) {
    for (const file of files) {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${productId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Erreur upload image: ${uploadError.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(uploadData.path);

      const { error: dbError } = await supabase.from("product_images").insert({
        product_id: productId,
        url: publicUrl,
        image_url: publicUrl,
        storage_path: uploadData.path,
        alt: "",
        is_featured: false,
        position: 0,
      });

      if (dbError) {
        throw new Error(`Erreur sauvegarde image: ${dbError.message}`);
      }
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "");
    const universe = String(formData.get("universe") || "");
    const category = String(formData.get("category") || "");

    if (!universe || !category) {
      setLoading(false);
      alert("Veuillez choisir un univers et une catégorie.");
      return;
    }

    const product = {
      name,
      slug: generateSlug(name),
      universe,
      category,
      price: Number(formData.get("price") || 0),
      stock: Number(formData.get("stock") || 0),
      short_description: String(formData.get("short_description") || ""),
      description: String(formData.get("description") || ""),
      featured: false,
      status: "active",
    };

    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select("id")
      .single();

    if (error || !data) {
      setLoading(false);
      alert(error?.message || "Erreur lors de la création du produit.");
      return;
    }

    try {
      if (selectedFiles.length > 0) {
        await uploadProductImages(data.id, selectedFiles);
      }

      router.push(`/admin/products/${data.id}/edit`);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur upload image.");
    } finally {
      setLoading(false);
    }
  }

  const availableCategories =
    selectedUniverse && selectedUniverse in categoriesByUniverse
      ? categoriesByUniverse[selectedUniverse]
      : [];

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border bg-white p-8">
      <div className="grid gap-6">
        <input
          name="name"
          placeholder="Nom du produit"
          required
          className="rounded-xl border p-3"
        />

        <select
          name="universe"
          required
          className="rounded-xl border p-3"
          value={selectedUniverse}
          onChange={(event) =>
            setSelectedUniverse(event.target.value as Universe | "")
          }
        >
          <option value="">Choisir un univers</option>
          <option value="loisirs">Loisirs</option>
          <option value="bien-etre">Bien-être</option>
          <option value="fitness">Fitness</option>
        </select>

        <select
          name="category"
          required
          disabled={!selectedUniverse}
          className="rounded-xl border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
          defaultValue=""
          key={selectedUniverse}
        >
          <option value="">
            {selectedUniverse
              ? "Choisir une catégorie"
              : "Choisir d’abord un univers"}
          </option>

          {availableCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Prix"
          required
          className="rounded-xl border p-3"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          defaultValue={0}
          className="rounded-xl border p-3"
        />

        <input
          name="short_description"
          placeholder="Description courte"
          className="rounded-xl border p-3"
        />

        <textarea
          name="description"
          placeholder="Description complète"
          rows={8}
          className="rounded-xl border p-3"
        />

        <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-[#f7f4ee] px-6 py-8 text-center transition hover:bg-white">
          <ImagePlus className="h-6 w-6" />

          <span className="font-medium">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} image(s) sélectionnée(s)`
              : "Ajouter des images"}
          </span>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) =>
              setSelectedFiles(Array.from(event.target.files || []))
            }
            className="hidden"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-black px-6 py-4 text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Création du produit..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}