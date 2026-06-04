"use server";

import { revalidatePath } from "next/cache";

import { deleteProduct } from "@/lib/products";

export async function deleteProductAction(productId: string) {
  try {
    await deleteProduct(productId);

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Produit supprimé.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erreur pendant la suppression du produit.",
    };
  }
}