// src/components/account/AccountDashboard.tsx

import Image from "next/image";
import Link from "next/link";

import OrdersList from "@/components/account/OrdersList";
import RemoveFavoriteButton from "@/components/account/RemoveFavoriteButton";
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
    <section className="space-y-5">
      {/* Banner */}
      <div className="rounded-[2rem] border border-black/10 bg-[#181512] px-7 py-6 text-white shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#d8bd7a]">
              Espace client
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Bonjour, {displayName}
            </h2>
          </div>

          <LogoutButton />
        </div>

        <div className="mt-5 flex flex-wrap gap-6 border-t border-white/10 pt-5">
          <Stat label="Commandes" value={String(orders.length)} />
          <Stat label="Devis" value={String(devisCount)} />
          <Stat label="Favoris" value={String(favorites.length)} />
        </div>
      </div>

      {/* Coordonnées */}
      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-[#181512]">
            Mes coordonnées
          </h2>

          <Link
            href={`/${locale}/mon-compte/informations`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#181512] transition hover:bg-[#f7f4ee]"
          >
            Modifier
          </Link>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <InfoItem label="Email" value={profile?.email || email} />
          <InfoItem label="Téléphone" value={profile?.phone} />
          <InfoItem label="Nom" value={displayName} />
          <InfoItem label="Adresse" value={address} />
        </div>
      </div>

      {/* Favoris */}
      <FavoritesSection locale={locale} favorites={favorites} />

      {/* Commandes */}
      <OrdersList locale={locale} orders={orders} />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-white/50">{label}</p>
      <p className="mt-0.5 text-xl font-semibold text-white">{value}</p>
    </div>
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
    <div
      id="favoris"
      className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-[#181512]">Mes favoris</h2>

        <Link
          href={`/${locale}`}
          className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#181512] transition hover:bg-[#f7f4ee]"
        >
          Continuer mes achats
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-[#f7f4ee] p-4">
          <p className="text-sm leading-6 text-neutral-600">
            Vous n&apos;avez pas encore ajouté de produits aux favoris. Lorsque
            vous cliquez sur le cœur d&apos;un produit, il apparaîtra ici.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {favorites.map((favorite) => {
            const product = favorite.products;

            if (!product) return null;

            const image = getFavoriteImage(product.product_media ?? []);
            const productHref = `/${locale}/products/${product.slug}`;

            return (
              <article
                key={favorite.id}
                className="flex gap-3 rounded-2xl border border-black/10 bg-[#f7f4ee] p-3 transition hover:bg-white hover:shadow-sm"
              >
                <Link
                  href={productHref}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-200 sm:h-20 sm:w-24"
                >
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      sizes="96px"
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] text-neutral-500">
                      Image indisponible
                    </div>
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b69a5b]">
                      {getCategoryLabel(product.category)}
                    </p>

                    <Link href={productHref}>
                      <h3 className="mt-0.5 line-clamp-1 text-sm font-semibold leading-5 text-[#181512] transition hover:underline">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#181512]">
                      {Number(product.price).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </p>

                    <div className="flex items-center gap-2">
                      <Link
                        href={productHref}
                        className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#181512] transition hover:bg-[#181512] hover:text-white"
                      >
                        Voir
                      </Link>

                      <RemoveFavoriteButton productId={product.id} />
                    </div>
                  </div>
                </div>
              </article>
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
    <div className="rounded-xl bg-[#f7f4ee] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-[#181512]">
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
    loisirs: "Loisirs",
  };

  return labels[category] ?? category;
}
