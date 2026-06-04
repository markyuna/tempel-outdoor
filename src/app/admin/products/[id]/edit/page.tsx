// src/app/admin/products/[id]/edit/page.tsx

import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ProductVariantsEditor from "@/components/admin/ProductVariantsEditor";

import ProductMediaUploader from "@/components/admin/ProductMediaUploader";
import ProductOptionsEditor from "@/components/admin/ProductOptionsEditor";
import ProductSpecsEditor from "@/components/admin/ProductSpecsEditor";
import { createClient } from "@/lib/supabase/server";
import type {
  ProductMedia,
  ProductOption,
  ProductSpecItem,
  ProductSpecSection,
} from "@/types/product";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

    const name = String(formData.get("name") || "");
    const slug = String(formData.get("slug") || "");
    const universe = String(formData.get("universe") || "");
    const category = String(formData.get("category") || "");
    const price = Number(formData.get("price") || 0);
    const compareAtPriceValue = String(formData.get("compare_at_price") || "");
    const stock = Number(formData.get("stock") || 0);
    const status = String(formData.get("status") || "draft");
    const featured = formData.get("featured") === "true";
    const deliveryTime = String(formData.get("delivery_time") || "");
    const shortDescription = String(formData.get("short_description") || "");
    const description = String(formData.get("description") || "");

    await supabase
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

    redirect(`/admin/products/${id}/edit`);
  }

  const [{ data: media }, { data: options }, { data: sections }, { data: variants }] =
  await Promise.all([
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
      .select("*")
      .eq("product_id", id)
      .order("position", { ascending: true }),

    supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", id)
      .order("position", { ascending: true }),
  ]);

  const sectionIds = sections?.map((section) => section.id) ?? [];

  const { data: specItems } =
    sectionIds.length > 0
      ? await supabase
          .from("product_spec_items")
          .select("*")
          .in("section_id", sectionIds)
          .order("position", { ascending: true })
      : { data: [] };

  const sectionsWithItems: ProductSpecSection[] =
    sections?.map((section) => ({
      ...section,
      items:
        specItems?.filter(
          (item: ProductSpecItem) => item.section_id === section.id
        ) ?? [],
    })) ?? [];

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#181512]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin/products"
              className="text-sm font-medium text-[#b87932] transition hover:text-black"
            >
              ← Retour aux produits
            </Link>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              {product.name}
            </h1>

            <p className="mt-2 text-sm text-[#5f5a54]">
              Modifier les informations, médias, options et fiche technique du
              produit.
            </p>
          </div>

          <Link
            href={`/fr/products/${product.slug}`}
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Voir côté boutique
          </Link>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <form
            action={updateProduct}
            className="rounded-3xl border bg-white p-8 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Informations générales</h2>

            <div className="mt-8 grid gap-5">
              <Input label="Nom du produit" name="name" defaultValue={product.name} />
              <Input label="Slug" name="slug" defaultValue={product.slug} />

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Univers"
                  name="universe"
                  defaultValue={product.universe ?? ""}
                />
                <Input
                  label="Catégorie"
                  name="category"
                  defaultValue={product.category ?? ""}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Input
                  label="Prix"
                  name="price"
                  type="number"
                  defaultValue={product.price ?? ""}
                />
                <Input
                  label="Prix barré"
                  name="compare_at_price"
                  type="number"
                  defaultValue={product.compare_at_price ?? ""}
                />
                <Input
                  label="Stock"
                  name="stock"
                  type="number"
                  defaultValue={product.stock ?? 0}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Select
                  label="Statut"
                  name="status"
                  defaultValue={product.status ?? "draft"}
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Active", value: "active" },
                    { label: "Archived", value: "archived" },
                  ]}
                />

                <Select
                  label="Produit mis en avant"
                  name="featured"
                  defaultValue={product.featured ? "true" : "false"}
                  options={[
                    { label: "Non", value: "false" },
                    { label: "Oui", value: "true" },
                  ]}
                />
              </div>

              <Input
                label="Délai de livraison"
                name="delivery_time"
                defaultValue={product.delivery_time ?? ""}
              />

              <Textarea
                label="Description courte"
                name="short_description"
                defaultValue={product.short_description ?? ""}
              />

              <Textarea
                label="Description complète"
                name="description"
                defaultValue={product.description ?? ""}
              />

              <button
                type="submit"
                className="mt-4 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#c76b2a]"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>

          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">Aperçu médias</h2>

            <p className="mt-2 text-sm text-[#5f5a54]">
              Images et vidéos actuellement associées à ce produit.
            </p>

            {media && media.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-4">
                {(media as ProductMedia[]).map((item) => (
                  <div
                    key={item.id}
                    className="relative h-40 overflow-hidden rounded-2xl border bg-[#f7f4ee]"
                  >
                    {item.type === "video" ? (
                      <video
                        src={item.url}
                        controls
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={item.url}
                        alt={item.alt || product.name}
                        fill
                        sizes="240px"
                        className="object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 flex h-40 items-center justify-center rounded-2xl border border-dashed bg-[#f7f4ee] text-sm text-[#8a8178]">
                Aucun média pour le moment
              </div>
            )}
          </div>
        </section>

        <div className="mt-8">
          <ProductMediaUploader productId={id} />
        </div>

        <div className="mt-8">
          <ProductVariantsEditor
            productId={id}
            media={(media ?? []) as ProductMedia[]}
            variants={(variants ?? [])}
          />
        </div>

        <div className="mt-8">
          <ProductOptionsEditor
            productId={id}
            options={(options ?? []) as ProductOption[]}
          />
        </div>

        <div className="mt-8">
          <ProductSpecsEditor productId={id} sections={sectionsWithItems} />
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#5f5a54]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border bg-[#f7f4ee] px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#5f5a54]">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={6}
        className="w-full rounded-2xl border bg-[#f7f4ee] px-4 py-3 text-sm leading-7 outline-none transition focus:border-black focus:bg-white"
      />
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: {
    label: string;
    value: string;
  }[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#5f5a54]">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border bg-[#f7f4ee] px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}