// src/components/products/ProductSpecs.tsx

type ProductSpecItem = {
  id: string;
  label: string | null;
  value: string;
  position: number | null;
};

type ProductSpecSection = {
  id: string;
  title: string;
  position: number | null;
  product_spec_items: ProductSpecItem[] | null;
};

type Props = {
  sections: ProductSpecSection[] | null;
};

export default function ProductSpecs({ sections }: Props) {
  const specs = [...(sections ?? [])]
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
    .flatMap((section) =>
      [...(section.product_spec_items ?? [])].sort(
        (a, b) => (a.position ?? 999) - (b.position ?? 999)
      )
    )
    .filter((item) => item.value.trim().length > 0);

  if (specs.length === 0) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
        <p className="text-sm text-neutral-500">
          Aucune caractéristique technique disponible.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c76b2a]">
        Fiche technique
      </p>

      <div className="mt-8 divide-y divide-black/10">
        {specs.map((item) => (
          <div
            key={item.id}
            className="grid gap-2 py-4 md:grid-cols-[220px_1fr] md:gap-8"
          >
            <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
              {item.label || "Spécification"}
            </p>

            <p className="text-sm font-semibold leading-6 text-neutral-950 md:text-base">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 border-t border-black/10 pt-5 text-xs leading-6 text-neutral-500">
        Les caractéristiques sont indiquées à titre informatif et peuvent varier
        légèrement selon la configuration sélectionnée.
      </p>
    </div>
  );
}