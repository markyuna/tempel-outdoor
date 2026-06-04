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
      <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-sm text-neutral-500">
          Aucune caractéristique technique disponible.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c76b2a]">
        Détails du produit
      </p>

      <h2 className="mt-3 text-3xl font-semibold">Caractéristiques</h2>

      <div className="mt-8 space-y-8">
        {sortedSections.map((section) => (
          <section key={section.id}>
            <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">
              {section.title}
            </h3>

            <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
              {section.product_spec_items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[0.9fr_1.1fr] border-b border-black/10 last:border-b-0"
                >
                  <div className="bg-[#f7f4ee] px-5 py-4 text-sm font-semibold text-neutral-700">
                    {item.label}
                  </div>

                  <div className="px-5 py-4 text-sm text-neutral-900">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}