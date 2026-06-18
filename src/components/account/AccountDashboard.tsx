// src/components/account/AccountDashboard.tsx

import Image from "next/image";
import Link from "next/link";

import DevisList from "@/components/account/DevisList";
import OrdersList from "@/components/account/OrdersList";
import LogoutButton from "@/components/auth/LogoutButton";

type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
  devis_number: string | null;
  devis_pdf_url: string | null;
  devis_generated_at: string | null;
};

type Profile = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
} | null;

type FavoriteMedia = {
  id: string;
  url: string;
  alt: string | null;
  type: "image" | "video";
  is_featured: boolean | null;
  position: number | null;
};

type FavoriteProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  short_description: string | null;
  category: string;
  universe: string;
  product_media: FavoriteMedia[] | null;
};

type Favorite = {
  id: string;
  created_at: string | null;
  products: FavoriteProduct | null;
};

type Props = {
  locale: string;
  email: string;
  profile: Profile;
  orders: Order[];
  favorites: Favorite[];
};

export default function AccountDashboard({
  locale,
  email,
  profile,
  orders,
  favorites,
}: Props) {
  const devisCount = orders.filter((order) => order.devis_pdf_url).length;

  const totalAmount = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    email;

  const address = [
    profile?.address,
    profile?.postal_code,
    profile?.city,
    profile?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-black/10 bg-[#181512] p-8 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.25em] text-[#d8bd7a]">
          Espace client
        </p>

        <h2 className="mt-4 text-3xl font-semibold">Bonjour, {displayName}</h2>

        <p className="mt-3 max-w-2xl text-white/70">
          Retrouvez ici vos commandes, vos devis disponibles, vos favoris et vos
          informations de livraison.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-500">Commandes</p>
          <p className="mt-2 text-3xl font-semibold text-[#181512]">
            {orders.length}
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-500">Devis disponibles</p>
          <p className="mt-2 text-3xl font-semibold text-[#181512]">
            {devisCount}
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-500">Favoris</p>
          <p className="mt-2 text-3xl font-semibold text-[#181512]">
            {favorites.length}
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-500">Total commandes</p>
          <p className="mt-2 text-3xl font-semibold text-[#181512]">
            {totalAmount.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#b69a5b]">
              Informations personnelles
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-[#181512]">
              Vos coordonnées
            </h2>
          </div>

          <Link
            href={`/${locale}/mon-compte/informations`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-[#181512] transition hover:bg-[#f7f4ee]"
          >
            Modifier mes informations
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <InfoItem label="Email" value={profile?.email || email} />
          <InfoItem label="Téléphone" value={profile?.phone} />
          <InfoItem label="Nom" value={displayName} />
          <InfoItem label="Adresse" value={address} />
        </div>
      </div>

      <FavoritesSection locale={locale} favorites={favorites} />

      <OrdersList locale={locale} orders={orders} />

      <DevisList orders={orders} />

      <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-[#181512]">Paramètres</h3>

        <div className="mt-5">
          <LogoutButton />
        </div>
      </div>
    </section>
  );
}

function FavoritesSection({
  locale,
  favorites,
}: {
  locale: string;
  favorites: Favorite[];
}) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#b69a5b]">
            Mes favoris
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-[#181512]">
            Produits enregistrés
          </h2>
        </div>

        <Link
          href={`/${locale}`}
          className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-[#181512] transition hover:bg-[#f7f4ee]"
        >
          Continuer mes achats
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-[#f7f4ee] p-6">
          <p className="text-sm leading-6 text-neutral-600">
            Vous n'avez pas encore ajouté de produits aux favoris. Lorsque vous
            cliquez sur le cœur d'un produit, il apparaîtra ici.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => {
            const product = favorite.products;

            if (!product) {
              return null;
            }

            const image = getFavoriteImage(product.product_media ?? []);
            const productHref = `/${locale}/products/${product.slug}`;

            return (
              <Link
                key={favorite.id}
                href={productHref}
                className="group overflow-hidden rounded-3xl border border-black/10 bg-[#f7f4ee] transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-neutral-500">
                      Image indisponible
                    </div>
                  )}

                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#181512] shadow-sm backdrop-blur">
                    Favori
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#b69a5b]">
                    {getCategoryLabel(product.category)}
                  </p>

                  <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-[#181512]">
                    {product.name}
                  </h3>

                  {product.short_description ? (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600">
                      {product.short_description}
                    </p>
                  ) : null}

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <p className="font-semibold text-[#181512]">
                      {Number(product.price).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </p>

                    <span className="text-sm font-medium text-[#181512] underline underline-offset-4">
                      Voir
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl bg-[#f7f4ee] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </p>

      <p className="mt-2 font-medium text-[#181512]">
        {value || "Non renseigné"}
      </p>
    </div>
  );
}

function getFavoriteImage(media: FavoriteMedia[]) {
  return (
    [...media]
      .filter((item) => item.type === "image")
      .sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;

        return (a.position ?? 999) - (b.position ?? 999);
      })[0] ?? null
  );
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    spa: "Spa",
    sauna: "Sauna",
    "baby-foot": "Baby-foot",
    billard: "Billard",
    fitness: "Fitness",
  };

  return labels[category] ?? category;
}