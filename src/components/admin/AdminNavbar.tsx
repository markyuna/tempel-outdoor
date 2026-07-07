"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Image, LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Produits", href: "/admin/products", icon: Package, exact: false },
  { label: "Réalisations", href: "/admin/realisations", icon: Image, exact: false },
  { label: "Commandes", href: "/admin/orders", icon: ShoppingBag, exact: false },
  { label: "Clients", href: "/admin/customers", icon: Users, exact: false },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <span className="shrink-0 text-sm font-semibold text-[#181512]">
          Tempel <span className="text-[#9c7b4f]">Admin</span>
        </span>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {navLinks.map(({ label, href, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-[#181512]/60 hover:bg-black/5 hover:text-[#181512]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/fr"
          target="_blank"
          className="flex shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#181512] transition hover:bg-black hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="hidden sm:inline">Voir le site</span>
        </Link>
      </div>
    </header>
  );
}
