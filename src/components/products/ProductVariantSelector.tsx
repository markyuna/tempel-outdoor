"use client";

type ProductVariant = {
  id: string;
  name: string;
  value: string;
  position: number | null;
  image_media_id: string | null;
};

type Props = {
  variants: ProductVariant[];
  selectedVariantId?: string | null;
  onSelect: (variant: ProductVariant) => void;
};

const COLOR_LABELS: Record<string, string> = {
  blanc: "Blanc",
  noir: "Noir",
  terracotta: "Terracotta",
  moutarde: "Moutarde",
  "bleu-eau": "Bleu eau",
};

const COLOR_HEX: Record<string, string> = {
  blanc: "#f5f0e8",
  noir: "#111111",
  terracotta: "#b76545",
  moutarde: "#c99a35",
  "bleu-eau": "#7faeaa",
};

export type { ProductVariant };

export default function ProductVariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: Props) {
  const sortedVariants = [...variants].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );

  if (sortedVariants.length === 0) return null;

  return (
    <div className="mt-8 border-t border-black/10 pt-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Couleur
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            Sélectionnez une finition
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {sortedVariants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const label = COLOR_LABELS[variant.value] || variant.value;
          const color = COLOR_HEX[variant.value] || "#ddd";

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant)}
              className={`group flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isSelected
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-white text-black hover:border-black/40"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full border ${
                  variant.value === "blanc" ? "border-black/20" : "border-white/40"
                }`}
                style={{ backgroundColor: color }}
              />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}