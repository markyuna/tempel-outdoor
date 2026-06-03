import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Billard convertible extérieur | Tempel Outdoor",
  description:
    "Découvrez nos billards convertibles outdoor, transformables en tables à manger élégantes.",
};

const products = [
  {
    name: "Table de billard convertible Blanc Hyphen Outdoor Tapis Gris Foncé + housse",
    price: "6 380,00 €",
    badge: "Design premium",
    href: "/fr/loisirs/billard/billard-blanc-hyphen-outdoor",
  },
  {
    name: "Table de billard convertible Noir Hyphen Outdoor Tapis Gris Foncé + housse",
    price: "6 380,00 €",
    badge: "Élégance noire",
    href: "/fr/loisirs/billard/billard-noir-hyphen-outdoor",
  },
  {
    name: "Billard table convertible Origin Outdoor Blanc + housse",
    price: "6 380,00 €",
    badge: "Table repas",
    href: "/fr/loisirs/billard/billard-origin-blanc",
  },
  {
    name: "Billard table convertible Origin Outdoor Noir + housse",
    price: "6 380,00 €",
    badge: "Choix premium",
    href: "/fr/loisirs/billard/billard-origin-noir",
  },
];

export default function BillardPage() {
  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b87932]">
            Loisirs premium
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            Billard convertible
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#5f5a54]">
            Des billards extérieurs convertibles en tables à manger, conçus pour
            associer design, convivialité et optimisation de l’espace.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.name}
              className="group overflow-hidden rounded-[2rem] border border-[#e6ded1] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Link href={product.href} className="block">
                <div className="flex aspect-[4/3] items-center justify-center bg-[#e8e0d4]">
                  <span className="text-sm uppercase tracking-[0.25em] text-[#8a8178]">
                    Image produit
                  </span>
                </div>
              </Link>

              <div className="p-6">
                <span className="inline-flex rounded-full bg-[#d7b86e] px-4 py-1 text-xs font-medium text-black">
                  {product.badge}
                </span>

                <h2 className="mt-4 min-h-20 text-lg font-semibold leading-7">
                  {product.name}
                </h2>

                <p className="mt-3 text-xl font-semibold">{product.price}</p>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#181512] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b241f]"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Ajouter au panier
                  </button>

                  <Link
                    href={product.href}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#181512]/20 px-5 py-3 text-sm font-semibold transition hover:border-[#181512] hover:bg-[#181512] hover:text-white"
                  >
                    Voir détails
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}