// src/components/admin/orders/GenerateDevisButton.tsx

"use client";

import { FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  orderId: string;
  hasDevis?: boolean;
};

export default function GenerateDevisButton({ orderId, hasDevis }: Props) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerateDevis() {
    setIsGenerating(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/generate-devis`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur génération devis.");
      }

      if (data.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Impossible de générer le devis.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGenerateDevis}
      disabled={isGenerating}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#181512] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b241f] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}

      {hasDevis ? "Régénérer le devis" : "Générer un devis"}
    </button>
  );
}