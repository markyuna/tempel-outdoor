// src/components/products/ProductSpecs.tsx

type ProductSpecItem = {
  id: string;
  label: string;
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
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((section) => ({
      ...section,
      product_spec_items: [...(section.product_spec_items ?? [])].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      ),
    }))
    .filter((section) => section.product_spec_items.length > 0);

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
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c76b2a]">
          Fiche technique
        </p>

      </div>

      <div className="mt-8 space-y-8">
        {sortedSections.map((section) => (
          <section key={section.id}>
            <h3 className="border-b border-black/10 pb-3 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
              {section.title}
            </h3>

            <div className="divide-y divide-black/10">
              {section.product_spec_items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 py-4 md:grid-cols-[220px_1fr] md:gap-8"
                >
                  <p className="text-sm font-medium text-neutral-500">
                    {item.label}
                  </p>

                  <p className="text-sm font-semibold leading-6 text-neutral-950 md:text-base">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 border-t border-black/10 pt-5 text-xs leading-6 text-neutral-500">
        Les caractéristiques sont indiquées à titre informatif et peuvent varier
        légèrement selon la configuration sélectionnée.
      </p>
    </div>
  );
}