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
  gris: "Gris — Mystic Mountain",
  beige: "Beige — Sterling White",
};

const COLOR_HEX: Record<string, string> = {
  blanc: "#f5f0e8",
  noir: "#111111",
  terracotta: "#b76545",
  moutarde: "#c99a35",
  "bleu-eau": "#7faeaa",
  gris: "#8a8378",
  beige: "#d9c9a8",
};

export type { ProductVariant };

export default function ProductVariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: Props) {
  if (variants.length === 0) return null;

  return (
    <div className="mt-4 rounded-[1.35rem] border border-black/10 bg-white/75 p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-neutral-500">
            Couleur
          </p>
          <p className="mt-1 text-xs text-neutral-600">
            Sélectionnez une finition
          </p>
        </div>

        <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
          {variants.map((variant) => {
            const isSelected = variant.id === selectedVariantId;
            const label = COLOR_LABELS[variant.value] || variant.value;
            const color = COLOR_HEX[variant.value] || "#ddd";

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => onSelect(variant)}
                aria-pressed={isSelected}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                  isSelected
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-black hover:border-black/40"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full border ${
                    variant.value === "blanc" || variant.value === "beige"
                      ? "border-black/20"
                      : "border-white/50"
                  }`}
                  style={{ backgroundColor: color }}
                />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}