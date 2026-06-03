import { supabaseAdmin } from "@/lib/supabase/admin";
import type {
  Product,
  ProductCategory,
  ProductImage,
  ProductOption,
  ProductSpecItem,
  ProductSpecSection,
  ProductStatus,
} from "@/types/product";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  category: ProductCategory;
  price: number | string;
  compare_at_price: number | string | null;
  featured: boolean | null;
  status: ProductStatus;
  stock: number | null;
  delivery_time: string | null;
  warranty: string | null;
  created_at: string;
  updated_at: string;
};

type ProductImageRow = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  is_featured: boolean | null;
  position: number | null;
};

type ProductOptionRow = {
  id: string;
  product_id: string;
  name: string;
  values: string[];
  required: boolean | null;
  position: number | null;
};

type ProductSpecSectionRow = {
  id: string;
  product_id: string;
  title: string;
  position: number | null;
};

type ProductSpecItemRow = {
  id: string;
  section_id: string;
  label: string | null;
  value: string;
  position: number | null;
};

export async function getProducts(): Promise<Product[]> {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return mapProducts(products ?? []);
}

export async function getActiveProductsByCategory(
  category: ProductCategory
): Promise<Product[]> {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return mapProducts(products ?? []);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!product) return null;

  const [mappedProduct] = await mapProducts([product]);

  return mappedProduct ?? null;
}

async function mapProducts(productRows: ProductRow[]): Promise<Product[]> {
  if (productRows.length === 0) return [];

  const productIds = productRows.map((product) => product.id);

  const [{ data: images }, { data: options }, { data: sections }] =
    await Promise.all([
      supabaseAdmin
        .from("product_images")
        .select("*")
        .in("product_id", productIds)
        .order("position", { ascending: true }),

      supabaseAdmin
        .from("product_options")
        .select("*")
        .in("product_id", productIds)
        .order("position", { ascending: true }),

      supabaseAdmin
        .from("product_spec_sections")
        .select("*")
        .in("product_id", productIds)
        .order("position", { ascending: true }),
    ]);

  const sectionRows = (sections ?? []) as ProductSpecSectionRow[];
  const sectionIds = sectionRows.map((section) => section.id);

  const { data: specItems } =
    sectionIds.length > 0
      ? await supabaseAdmin
          .from("product_spec_items")
          .select("*")
          .in("section_id", sectionIds)
          .order("position", { ascending: true })
      : { data: [] };

  return productRows.map((product) => {
    const productImages = ((images ?? []) as ProductImageRow[])
      .filter((image) => image.product_id === product.id)
      .map<ProductImage>((image) => ({
        id: image.id,
        productId: image.product_id,
        url: image.url,
        alt: image.alt,
        isFeatured: Boolean(image.is_featured),
        position: image.position ?? 0,
      }));

    const productOptions = ((options ?? []) as ProductOptionRow[])
      .filter((option) => option.product_id === product.id)
      .map<ProductOption>((option) => ({
        id: option.id,
        productId: option.product_id,
        name: option.name,
        values: option.values ?? [],
        required: Boolean(option.required),
        position: option.position ?? 0,
      }));

    const productSections = sectionRows
      .filter((section) => section.product_id === product.id)
      .map<ProductSpecSection>((section) => {
        const items = ((specItems ?? []) as ProductSpecItemRow[])
          .filter((item) => item.section_id === section.id)
          .map<ProductSpecItem>((item) => ({
            id: item.id,
            sectionId: item.section_id,
            label: item.label,
            value: item.value,
            position: item.position ?? 0,
          }));

        return {
          id: section.id,
          productId: section.product_id,
          title: section.title,
          position: section.position ?? 0,
          items,
        };
      });

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      shortDescription: product.short_description,
      description: product.description,
      category: product.category,
      price: Number(product.price),
      compareAtPrice:
        product.compare_at_price === null ? null : Number(product.compare_at_price),
      featured: Boolean(product.featured),
      status: product.status,
      stock: product.stock ?? 0,
      deliveryTime: product.delivery_time,
      warranty: product.warranty,
      images: productImages,
      options: productOptions,
      specSections: productSections,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  });
}