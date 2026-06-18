// src/components/admin/orders/DeleteOrderButton.tsx

"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

type DeleteOrderButtonProps = {
  orderId: string;
  action: (formData: FormData) => Promise<void>;
  variant?: "full" | "icon";
};

export default function DeleteOrderButton({
  orderId,
  action,
  variant = "full",
}: DeleteOrderButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible."
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.append("orderId", orderId);

    startTransition(() => {
      action(formData);
    });
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Supprimer la commande"
        title="Supprimer la commande"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Suppression..." : "Supprimer la commande"}
    </button>
  );
}