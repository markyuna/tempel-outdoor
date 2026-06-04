"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { deleteProductAction } from "@/app/admin/products/actions";

type Props = {
  productId: string;
  productName: string;
};

export default function DeleteProductButton({ productId, productName }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Supprimer définitivement "${productName}" ?`
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteProductAction(productId);

      if (!result.success) {
        alert(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      aria-label={`Supprimer ${productName}`}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 size={16} />
    </button>
  );
}