import {
  BadgeCheck,
  Check,
  CircleDot,
  Layers,
  PackageCheck,
  Ruler,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Weight,
} from "lucide-react";

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

function getSpecIcon(label: string) {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("dimension")) return Ruler;
  if (normalizedLabel.includes("poids")) return Weight;
  if (normalizedLabel.includes("garantie")) return ShieldCheck;
  if (normalizedLabel.includes("structure")) return Layers;
  if (normalizedLabel.includes("surface")) return CircleDot;
  if (normalizedLabel.includes("réglage")) return SlidersHorizontal;
  if (normalizedLabel.includes("accessoire")) return PackageCheck;

  return Sparkles;
}

function isAccessoriesSection(title: string) {
  const normalizedTitle = title.toLowerCase();

  return (
    normalizedTitle.includes("accessoire") ||
    normalizedTitle.includes("inclus") ||
    normalizedTitle.includes("included")
  );
}

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
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c76b2a]">
            Détails du produit
          </p>

          <h2 className="mt-3 text-3xl font-semibold">Caractéristiques</h2>
        </div>

        <div className="hidden rounded-full bg-[#f7f4ee] px-4 py-2 text-xs font-semibold text-neutral-600 md:block">
          Fiche premium
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {sortedSections.map((section) => {
          const isAccessory = isAccessoriesSection(section.title);

          return (
            <section key={section.id}>
              <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">
                {section.title}
              </h3>

              {isAccessory ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {section.product_spec_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-2xl border border-black/10 bg-[#fbfaf7] p-4"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>

                      <div>
                        <p className="text-sm font-semibold text-neutral-900">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {section.product_spec_items.map((item) => {
                    const Icon = getSpecIcon(item.label);

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-5 transition hover:-translate-y-0.5 hover:border-black/20 hover:bg-white hover:shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                              {item.label}
                            </p>

                            <p className="mt-2 text-base font-semibold leading-6 text-neutral-950">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl bg-black p-5 text-white">
        <div className="flex gap-3">
          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#d7b86e]" />
          <p className="text-sm leading-6 text-white/75">
            Les caractéristiques sont indiquées à titre informatif et peuvent
            varier légèrement selon la configuration sélectionnée.
          </p>
        </div>
      </div>
    </div>
  );
}