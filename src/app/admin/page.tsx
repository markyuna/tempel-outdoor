import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-4xl font-semibold">
        Dashboard Tempel Outdoor
      </h1>

      <p className="mt-4 text-[#5f5a54]">
        Gérez vos produits, catégories et commandes.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Link
          href="/admin/products"
          className="rounded-3xl border bg-white p-8 shadow-sm hover:shadow-xl"
        >
          Produits
        </Link>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          Commandes
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          Clients
        </div>
      </div>
    </div>
  );
}