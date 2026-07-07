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
  const sortedSections = [...(sections ?? [])]
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
    .map((section) => ({
      ...section,
      items: [...(section.product_spec_items ?? [])]
        .sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
        .filter((item) => item.value.trim().length > 0),
    }))
    .filter((section) => section.items.length > 0);

  if (sortedSections.length === 0) {
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

      <div className="mt-6 space-y-8">
        {sortedSections.map((section) => (
          <div key={section.id}>
            {sortedSections.length > 1 && (
              <p className="mb-3 text-sm font-semibold text-[#181512]">
                {section.title}
              </p>
            )}

            <div className="divide-y divide-black/10">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 py-3 md:grid-cols-[200px_1fr] md:gap-6"
                >
                  <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                    {item.label || "Spécification"}
                  </p>

                  <p className="text-sm font-semibold leading-6 text-neutral-950">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-black/10 pt-4 text-xs leading-6 text-neutral-500">
        Les caractéristiques sont indiquées à titre informatif et peuvent varier
        légèrement selon la configuration sélectionnée.
      </p>
    </div>
  );
}
