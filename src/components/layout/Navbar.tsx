// src/components/layout/Navbar.tsx

"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/Button";

const navItems = [
  { label: "Accueil", href: "/fr" },
  { label: "Bien-être", href: "/fr/bien-etre" },
  { label: "Loisirs", href: "/fr/loisirs" },
  { label: "Fitness", href: "/fr/fitness" },
  { label: "Réalisations", href: "/fr/realisations" },
  { label: "Contact", href: "/fr/contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black text-white">
      <div className="hidden border-b border-white/10 bg-[#d7b86e] px-6 py-2 text-sm text-black md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>Livraison France & Europe</span>
          <span>Paiement 2x 3x 4x avec Alma</span>
          <span>Conseiller expert : contact@tempel-outdoor.fr</span>
        </div>
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/fr" className="text-xl font-semibold tracking-[0.3em]">
          TEMPEL
          <span className="ml-2 text-xs tracking-[0.4em] text-[#d7b86e]">
            OUTDOOR
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium uppercase tracking-wide text-white/80 transition hover:text-[#d7b86e]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}