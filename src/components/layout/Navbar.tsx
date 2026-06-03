// src/components/layout/Navbar.tsx

"use client";

import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Accueil", href: "/fr" },
  {
    label: "Bien-être",
    children: [
      { label: "Spa extérieur", href: "/fr/bien-etre/spa" },
      { label: "Sauna bois", href: "/fr/bien-etre/sauna" },
    ],
  },
  {
    label: "Loisirs",
    children: [
      { label: "Baby-foot extérieur", href: "/fr/loisirs/baby-foot" },
      { label: "Billard convertible", href: "/fr/loisirs/billard" },
    ],
  },
  { label: "Fitness", href: "/fr/fitness" },
  { label: "Réalisations", href: "/fr/realisations" },
  { label: "Contact", href: "/fr/contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-white/80 transition hover:text-[#d7b86e]"
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4 transition duration-300 group-hover:rotate-180" />
                </button>

                <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-5 w-64 -translate-x-1/2 translate-y-2 rounded-3xl border border-white/10 bg-[#0b0b0b]/95 p-3 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="absolute -top-5 left-0 h-5 w-full" />

                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="group/item flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-[#d7b86e]"
                    >
                      {child.label}
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d7b86e] opacity-0 transition group-hover/item:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium uppercase tracking-wide text-white/80 transition hover:text-[#d7b86e]"
              >
                {item.label}
              </Link>
            )
          )}
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

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-black px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-5">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div className="flex items-center justify-between text-sm font-medium uppercase tracking-wide text-white/80">
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between text-sm font-medium uppercase tracking-wide text-white/80 transition hover:text-[#d7b86e]"
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && (
                  <div className="mt-3 flex flex-col gap-3 border-l border-white/10 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-white/60 transition hover:text-[#d7b86e]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}