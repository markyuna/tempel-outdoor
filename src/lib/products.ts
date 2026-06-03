// src/lib/products.ts

import { createClient } from "@/lib/supabase/server";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "@/types/product";

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

export async function getProductById(
  id: string
): Promise<Product | null> {
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

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
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

export async function createProduct(
  product: CreateProductInput
) {
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

export async function updateProduct(
  product: UpdateProductInput
) {
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

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}