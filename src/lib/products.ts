import { createClient } from "@/lib/supabase/server";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "@/types/product";

const PRODUCT_MEDIA_BUCKET = "product-media";

function getStoragePathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${PRODUCT_MEDIA_BUCKET}/`;
  const index = url.indexOf(marker);

  if (index === -1) return null;

  return decodeURIComponent(url.slice(index + marker.length));
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur getProducts:", error);
    return [];
  }

  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur getProductById:", error);
    return null;
  }

  return data as Product;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Erreur getProductBySlug:", error);
    return null;
  }

  return data as Product;
}

export async function createProduct(product: CreateProductInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateProduct(product: UpdateProductInput) {
  const supabase = await createClient();

  const { id, ...values } = product;

  const { data, error } = await supabase
    .from("products")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { data: media, error: mediaError } = await supabase
    .from("product_media")
    .select("id, url")
    .eq("product_id", id);

  if (mediaError) {
    throw new Error(mediaError.message);
  }

  const filesToDelete =
    media
      ?.map((item) => getStoragePathFromPublicUrl(item.url))
      .filter((path): path is string => Boolean(path)) || [];

  if (filesToDelete.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(PRODUCT_MEDIA_BUCKET)
      .remove(filesToDelete);

    if (storageError) {
      console.error("Erreur suppression storage:", storageError);
      throw new Error(storageError.message);
    }
  }

  const { error: productMediaError } = await supabase
    .from("product_media")
    .delete()
    .eq("product_id", id);

  if (productMediaError) {
    throw new Error(productMediaError.message);
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}