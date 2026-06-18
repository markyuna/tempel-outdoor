// src/components/products/FavoriteButton.tsx

"use client";

import React, { useState, useTransition } from "react";
import { Heart } from "lucide-react";

type FavoriteButtonProps = {
  productId: string;
  initialIsFavorite?: boolean;
  locale?: string;
};

export default function FavoriteButton({
  productId,
  initialIsFavorite = false,
  locale = "fr",
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggleFavorite() {
    setErrorMessage(null);

    startTransition(async () => {
      const nextIsFavorite = !isFavorite;

      setIsFavorite(nextIsFavorite);

      try {
        const response = await fetch("/api/favorites", {
          method: nextIsFavorite ? "POST" : "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          setIsFavorite(!nextIsFavorite);

          if (response.status === 401) {
            window.location.href = `/${locale}/auth/login`;
            return;
          }

          setErrorMessage(
            result?.error ||
              "Impossible de mettre à jour ce produit dans vos favoris."
          );

          return;
        }

        setIsFavorite(Boolean(result?.isFavorite));
      } catch (error) {
        console.error("Erreur favori:", error);

        setIsFavorite(!nextIsFavorite);
        setErrorMessage(
          "Une erreur est survenue. Veuillez réessayer dans quelques instants."
        );
      }
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleToggleFavorite}
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#181512] shadow-sm transition hover:bg-[#f7f4ee] disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart
          className={`h-4 w-4 transition ${
            isFavorite ? "fill-red-500 text-red-500" : "text-[#181512]"
          }`}
        />

        {isPending
          ? "Mise à jour..."
          : isFavorite
            ? "Produit ajouté aux favoris"
            : "Ajouter aux favoris"}
      </button>

      {errorMessage ? (
        <p className="text-sm font-medium text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}