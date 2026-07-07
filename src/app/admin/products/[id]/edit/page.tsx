// src/app/admin/products/[id]/edit/page.tsx

import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import ProductMediaUploader from "@/components/admin/ProductMediaUploader";
import ProductOptionsEditor from "@/components/admin/ProductOptionsEditor";
import ProductSpecsEditor from "@/components/admin/ProductSpecsEditor";
import ProductVariantsEditor from "@/components/admin/ProductVariantsEditor";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const BUCKET_NAME = "product-media";

function getStoragePathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(index + marker.length));
}

export default async function AdminProductEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (productError || !product) {
    notFound();
  }

  async function updateProduct(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const name = String(formData.get("name") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const universe = String(formData.get("universe") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const price = Number(formData.get("price") || 0);
    const compareAtPriceValue = String(formData.get("compare_at_price") || "");
    const stock = Number(formData.get("stock") || 0);
    const status = String(formData.get("status") || "draft");
    const featured = formData.get("featured") === "true";
    const deliveryTime = String(formData.get("delivery_time") || "").trim();
    const shortDescription = String(
      formData.get("short_description") || ""
    ).trim();
    const description = String(formData.get("description") || "").trim();

    const { error } = await supabase
      .from("products")
      .update({
        name,
        slug,
        universe,
        category,
        price,
        compare_at_price: compareAtPriceValue
          ? Number(compareAtPriceValue)
          : null,
        stock,
        status,
        featured,
        delivery_time: deliveryTime || null,
        short_description: shortDescription || null,
        description: description || null,
      })
      .eq("id", id);

    if (error) {
      throw new Error(`Erreur modification produit: ${error.message}`);
    }

    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath(`/fr/products/${slug}`);

    redirect(`/admin/products/${id}/edit`);
  }

  async function setProductMediaCover(formData: FormData) {
    "use server";

    const mediaId = String(formData.get("mediaId") || "");

    if (!mediaId) {
      return;
    }

    const supabase = await createClient();

    const { error: resetError } = await supabase
      .from("product_media")
      .update({ is_featured: false })
      .eq("product_id", id);

    if (resetError) {
      throw new Error(`Erreur reset cover: ${resetError.message}`);
    }

    const { error: coverError } = await supabase
      .from("product_media")
      .update({ is_featured: true })
      .eq("id", mediaId)
      .eq("product_id", id);

    if (coverError) {
      throw new Error(`Erreur cover média: ${coverError.message}`);
    }

    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath(`/fr/products/${product.slug}`);
  }

  async function reorderProductMedia(mediaIds: string[]) {
    "use server";

    if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
      return;
    }

    const supabase = await createClient();

    await Promise.all(
      mediaIds.map(async (mediaId, index) => {
        const { error } = await supabase
          .from("product_media")
          .update({ position: index })
          .eq("id", mediaId)
          .eq("product_id", id);

        if (error) {
          throw new Error(`Erreur réorganisation médias: ${error.message}`);
        }
      })
    );

    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath(`/fr/products/${product.slug}`);
  }

  async function deleteProductMedia(formData: FormData) {
    "use server";

    const mediaId = String(formData.get("mediaId") || "");
    const mediaUrl = String(formData.get("mediaUrl") || "");

    if (!mediaId) {
      return;
    }

    const supabase = await createClient();
    const storagePath = getStoragePathFromPublicUrl(mediaUrl);

    if (storagePath) {
      await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
    }

    const { error: deleteError } = await supabase
      .from("product_media")
      .delete()
      .eq("id", mediaId)
      .eq("product_id", id);

    if (deleteError) {
      throw new Error(`Erreur suppression média: ${deleteError.message}`);
    }

    const { data: remainingMedia, error: remainingError } = await supabase
      .from("product_media")
      .select("id")
      .eq("product_id", id)
      .order("position", { ascending: true });

    if (remainingError) {
      throw new Error(`Erreur reload médias: ${remainingError.message}`);
    }

    await Promise.all(
      (remainingMedia ?? []).map(async (item, index) => {
        const { error: updateError } = await supabase
          .from("product_media")
          .update({
            position: index,
            is_featured: index === 0,
          })
          .eq("id", item.id)
          .eq("product_id", id);

        if (updateError) {
          throw new Error(
            `Erreur réorganisation médias: ${updateError.message}`
          );
        }
      })
    );

    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath(`/fr/products/${product.slug}`);
  }

  const [
    { data: media },
    { data: options },
    { data: sections },
    { data: variants },
  ] = await Promise.all([
    supabase
      .from("product_media")
      .select("*")
      .eq("product_id", id)
      .order("position", { ascending: true }),

    supabase
      .from("product_options")
      .select("*")
      .eq("product_id", id)
      .order("position", { ascending: true }),

    supabase
      .from("product_spec_sections")
      .select(
        `
        *,
        product_spec_items (*)
      `
      )
      .eq("product_id", id)
      .order("position", { ascending: true }),

    supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", id)
      .order("position", { ascending: true }),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-12 text-black">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-sm text-black/60 transition hover:text-black"
          >
            ← Retour aux produits
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-black/45">
            Admin
          </p>

          <h1 className="mt-2 text-4xl font-semibold">Modifier le produit</h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
            Gérez les informations principales, le contenu commercial, les
            médias, les options, les variantes et la fiche technique du produit.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px]">
          <form
            action={updateProduct}
            className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.06)]"
          >
            <div className="border-b border-black/10 bg-[#fbf7ee] px-8 py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6a21]">
                Informations produit
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-black">
                Base commerciale
              </h2>

              <p className="mt-2 text-sm leading-6 text-black/55">
                Ces informations structurent la fiche produit visible côté
                client.
              </p>
            </div>

            <div className="grid gap-6 p-8 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold">Nom</span>
                <input
                  name="name"
                  defaultValue={product.name ?? ""}
                  required
                  placeholder="Ex : Spa Serene 3 places"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Slug</span>
                <input
                  name="slug"
                  defaultValue={product.slug ?? ""}
                  required
                  placeholder="ex : spa-serene-3-places"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Univers</span>
                <select
                  name="universe"
                  defaultValue={product.universe ?? "bien-etre"}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                >
                  <option value="bien-etre">Bien-être</option>
                  <option value="loisirs">Loisirs</option>
                  <option value="fitness">Fitness</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Catégorie</span>
                <select
                  name="category"
                  defaultValue={product.category ?? "spa"}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                >
                  <option value="spa">Spa</option>
                  <option value="sauna">Sauna</option>
                  <option value="baby-foot">Baby-foot</option>
                  <option value="billard">Billard</option>
                  <option value="fitness">Fitness</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Prix</span>
                <input
                  type="number"
                  name="price"
                  defaultValue={product.price ?? 0}
                  min={0}
                  step="0.01"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Prix barré</span>
                <input
                  type="number"
                  name="compare_at_price"
                  defaultValue={product.compare_at_price ?? ""}
                  min={0}
                  step="0.01"
                  placeholder="Optionnel"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Stock</span>
                <input
                  type="number"
                  name="stock"
                  defaultValue={product.stock ?? 0}
                  min={0}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Statut</span>
                <select
                  name="status"
                  defaultValue={product.status ?? "draft"}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                >
                  <option value="active">Actif</option>
                  <option value="draft">Brouillon</option>
                  <option value="archived">Archivé</option>
                </select>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold">
                  Délai de livraison
                </span>
                <input
                  name="delivery_time"
                  defaultValue={product.delivery_time ?? ""}
                  placeholder="Ex : Livraison sous 4 semaines"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#fbf7ee] px-4 py-3">
                <input
                  type="checkbox"
                  name="featured"
                  value="true"
                  defaultChecked={Boolean(product.featured)}
                  className="h-4 w-4 rounded border-black/20"
                />

                <span className="text-sm font-semibold">Produit phare</span>
              </label>

              <div className="md:col-span-2 rounded-[2rem] border border-black/10 bg-[#fbf7ee] p-5">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6a21]">
                    Contenu produit
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-black">
                    Descriptions visibles sur la fiche produit
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-black/55">
                    La description courte apparaît dans la zone d’achat, près du
                    prix. La description complète apparaît plus bas sur la page
                    produit, dans le bloc premium “Description”.
                  </p>
                </div>

                <div className="grid gap-5">
                  <label className="space-y-2">
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-sm font-semibold">
                        Description courte
                      </span>

                      <span className="text-xs text-black/40">
                        2 à 3 lignes maximum
                      </span>
                    </div>

                    <textarea
                      name="short_description"
                      defaultValue={product.short_description ?? ""}
                      rows={3}
                      placeholder="Ex : Spa compact 3 places pensé pour les petits espaces, avec 2 assises, 1 place allongée et 32 jets de massage."
                      className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-black"
                    />
                  </label>

                  <label className="space-y-2">
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-sm font-semibold">
                        Description complète
                      </span>

                      <span className="text-xs text-black/40">
                        Texte commercial affiché sous la galerie
                      </span>
                    </div>

                    <textarea
                      name="description"
                      defaultValue={product.description ?? ""}
                      rows={8}
                      placeholder="Ex : Le Spa Serene 3 places est conçu pour offrir une expérience de relaxation complète dans un format compact, idéal pour les terrasses, jardins ou espaces bien-être plus réduits..."
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-black"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 bg-white px-8 py-6">
              <p className="text-xs leading-5 text-black/45">
                Les changements seront visibles sur la fiche produit après
                enregistrement.
              </p>

              <button
                type="submit"
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <ProductMediaUploader
              productId={product.id}
              productName={product.name}
              productCategory={product.category}
              media={media ?? []}
              setCoverAction={setProductMediaCover}
              reorderMediaAction={reorderProductMedia}
              deleteMediaAction={deleteProductMedia}
            />
          </aside>
        </div>

        <div className="mt-8 grid gap-8">
          <ProductVariantsEditor
            productId={product.id}
            variants={variants ?? []}
            media={media ?? []}
          />

          <ProductOptionsEditor productId={product.id} options={options ?? []} />

          <ProductSpecsEditor productId={product.id} sections={sections ?? []} />
        </div>
      </div>
    </main>
  );
}