import Link from "next/link";
import {
  FolderKanban,
  Image,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

const adminCards = [
  {
    title: "Produits",
    description: "Ajoutez, modifiez et organisez le catalogue.",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Réalisations",
    description: "Ajoutez les installations clients et projets livrés.",
    href: "/admin/realisations",
    icon: Image,
  },
  {
    title: "Commandes",
    description: "Suivez les demandes et commandes clients.",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Catégories",
    description: "Organisez les univers Spa, Sauna, Billard...",
    href: "/admin/categories",
    icon: FolderKanban,
  },
  {
    title: "Clients",
    description: "Consultez les contacts et clients.",
    href: "/admin/customers",
    icon: Users,
  },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-black/45">
          Administration
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Dashboard Tempel Outdoor
        </h1>

        <p className="mt-4 text-lg text-[#5f5a54]">
          Gérez le catalogue, les réalisations clients et les contenus premium
          du site.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {adminCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white transition group-hover:scale-105">
                <Icon size={22} />
              </div>

              <h2 className="text-xl font-semibold">{card.title}</h2>

              <p className="mt-3 text-sm leading-6 text-black/55">
                {card.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}