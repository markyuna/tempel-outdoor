// src/components/account/RemoveFavoriteButton.tsx

"use client";

import { HeartOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type RemoveFavoriteButtonProps = {
  productId: string;
};

export default function RemoveFavoriteButton({
  productId,
}: RemoveFavoriteButtonProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleRemoveFavorite() {
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/favorites", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          setError(
            result?.error || "Impossible de retirer ce produit des favoris."
          );

          return;
        }

        router.refresh();
      } catch (error) {
        console.error("Erreur suppression favori:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    });
  }

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={handleRemoveFavorite}
        disabled={isPending}
        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#181512] transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <HeartOff className="h-3.5 w-3.5" />
        {isPending ? "..." : "Retirer"}
      </button>

      {error ? (
        <p className="max-w-[180px] text-xs font-medium leading-4 text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}