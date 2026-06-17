// src/components/layout/Navbar.tsx

"use client";

import Image from "next/image";
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
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const CART_STORAGE_KEY = "tempel_cart";

type CartItem = {
  quantity: number;
};

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

function getCartCount() {
  if (typeof window === "undefined") return 0;

  try {
    const cart = JSON.parse(
      window.localStorage.getItem(CART_STORAGE_KEY) || "[]"
    ) as CartItem[];

    return cart.reduce((total, item) => total + item.quantity, 0);
  } catch {
    return 0;
  }
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    function updateCartCount() {
      setCartCount(getCartCount());
    }

    updateCartCount();

    window.addEventListener("tempel-cart-updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("tempel-cart-updated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsAuthenticated(Boolean(user));
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const accountHref = isAuthenticated ? "/fr/mon-compte" : "/fr/auth/login";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black text-white">
      <div className="hidden border-b border-white/10 bg-[#d7b86e] px-6 py-2 text-sm text-black md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>Livraison France</span>
          <span>Paiement 2x 3x 4x avec Alma</span>
          <span>Conseiller expert : contact@tempel-outdoor.fr</span>
        </div>
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href="/fr"
          aria-label="Tempel Outdoor - Accueil"
          className="relative flex shrink-0 items-center"
        >
          <Image
            src="/images/logo.png"
            alt="Tempel Outdoor"
            width={240}
            height={80}
            priority
            className="h-auto w-42.5 object-contain sm:w-[190px] xl:w-[220px]"
          />
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
          <Button variant="ghost" size="icon" aria-label="Rechercher">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" aria-label="Favoris">
            <Heart className="h-5 w-5" />
          </Button>

          <Link
            href={accountHref}
            aria-label={isAuthenticated ? "Mon compte" : "Connexion"}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-white/10"
          >
            <User className="h-5 w-5" />

            {isAuthenticated ? (
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#d7b86e]" />
            ) : null}
          </Link>

          <Link
            href="/fr/cart"
            aria-label="Voir le panier"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-white/10"
          >
            <ShoppingBag className="h-5 w-5" />

            {cartCount > 0 ? (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d7b86e] px-1.5 text-[11px] font-bold text-black">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href={accountHref}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10"
            aria-label={isAuthenticated ? "Mon compte" : "Connexion"}
          >
            <User className="h-5 w-5" />

            {isAuthenticated ? (
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#d7b86e]" />
            ) : null}
          </Link>

          <Link
            href="/fr/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10"
            aria-label="Voir le panier"
          >
            <ShoppingBag className="h-5 w-5" />

            {cartCount > 0 ? (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d7b86e] px-1.5 text-[11px] font-bold text-black">
                {cartCount}
              </span>
            ) : null}
          </Link>

          <Button
            variant="ghost"
            size="icon"
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

            <Link
              href={accountHref}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium uppercase tracking-wide text-white/80 transition hover:border-[#d7b86e] hover:text-[#d7b86e]"
            >
              <User className="h-5 w-5" />
              {isAuthenticated ? "Mon compte" : "Connexion"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}