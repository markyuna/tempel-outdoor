import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

  const [
    { data: media },
    { data: options },
    { data: sections },
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
              href="/admin/produits"
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
            href={`/fr/${product.universe}/${product.category}/${product.slug}`}
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Voir côté boutique
          </Link>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">
              Informations générales
            </h2>

            <div className="mt-8 grid gap-5">
              <Field label="Nom du produit" value={product.name} />
              <Field label="Slug" value={product.slug} />

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Univers" value={product.universe ?? "—"} />
                <Field label="Catégorie" value={product.category ?? "—"} />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Prix" value={`${product.price} €`} />
                <Field
                  label="Prix barré"
                  value={
                    product.compare_at_price
                      ? `${product.compare_at_price} €`
                      : "—"
                  }
                />
                <Field label="Stock" value={`${product.stock ?? 0}`} />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Statut"
                  value={product.status ?? "draft"}
                />
                <Field
                  label="Produit mis en avant"
                  value={product.featured ? "Oui" : "Non"}
                />
              </div>

              <Field
                label="Délai de livraison"
                value={product.delivery_time ?? "—"}
              />

              <Field
                label="Description courte"
                value={product.short_description ?? "—"}
                multiline
              />

              <Field
                label="Description complète"
                value={product.description ?? "—"}
                multiline
              />
            </div>
          </div>

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
          <ProductOptionsEditor
            productId={id}
            options={(options ?? []) as ProductOption[]}
          />
        </div>

        <div className="mt-8">
          <ProductSpecsEditor
            productId={id}
            sections={sectionsWithItems}
          />
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-[#5f5a54]">{label}</p>

      <div
        className={
          multiline
            ? "min-h-28 rounded-2xl border bg-[#f7f4ee] p-4 text-sm leading-7"
            : "rounded-2xl border bg-[#f7f4ee] px-4 py-3 text-sm"
        }
      >
        {value}
      </div>
    </div>
  );
}