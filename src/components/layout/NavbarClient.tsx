// src/components/layout/NavbarClient.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  CreditCard,
  Heart,
  Mail,
  Menu,
  ShoppingBag,
  Truck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const CART_STORAGE_KEY = "tempel_cart";

type NavbarClientProps = {
  initialIsAuthenticated: boolean;
};

type CartItem = {
  quantity: number;
};

type NavItem = {
  label: string;
  href?: string;
  children?: {
    label: string;
    href: string;
  }[];
};

type TopBarItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
};

const topBarItems: TopBarItem[] = [
  {
    label: "Livraison France",
    icon: Truck,
  },
  {
    label: "Paiement 2× 3× 4× avec Alma",
    icon: CreditCard,
  },
  {
    label: "Conseiller expert : contact@tempel-outdoor.fr",
    icon: Mail,
    href: "mailto:contact@tempel-outdoor.fr",
  },
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

function isAuthSessionMissingError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AuthSessionMissingError"
  );
}

function TopBarServiceItem({ item }: { item: TopBarItem }) {
  const Icon = item.icon;

  const content = (
    <>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/25 shadow-sm ring-1 ring-white/35 transition group-hover:bg-white/40">
        <Icon className="h-4 w-4" />
      </span>

      <span className="whitespace-nowrap font-medium tracking-wide">
        {item.label}
      </span>
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        className="group flex items-center gap-2 transition hover:text-black"
      >
        {content}
      </a>
    );
  }

  return <div className="flex items-center gap-2">{content}</div>;
}

export default function NavbarClient({
  initialIsAuthenticated,
}: NavbarClientProps) {
  const locale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialIsAuthenticated
  );

  const accountHref = isAuthenticated ? `/${locale}/mon-compte` : `/${locale}/auth/login`;
  const favoritesHref = `/${locale}/mon-compte#favoris`;

  const navItems: NavItem[] = [
    { label: "Accueil", href: `/${locale}` },
    {
      label: "Bien-être",
      children: [
        { label: "Spa extérieur", href: `/${locale}/bien-etre/spa` },
        { label: "Sauna bois", href: `/${locale}/bien-etre/sauna` },
      ],
    },
    {
      label: "Loisirs",
      children: [
        { label: "Baby-foot extérieur", href: `/${locale}/loisirs/baby-foot` },
        { label: "Billard convertible", href: `/${locale}/loisirs/billard` },
      ],
    },
    { label: "Fitness", href: `/${locale}/fitness` },
    { label: "Réalisations", href: `/${locale}/realisations` },
    { label: "Contact", href: `/${locale}/contact` },
  ];

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

    async function checkUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error && !isAuthSessionMissingError(error)) {
        console.error("Erreur récupération utilisateur navbar client:", error);
      }

      setIsAuthenticated(Boolean(user));
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black text-white">
      <div className="hidden border-b border-white/10 bg-gradient-to-r from-[#b9954f] via-[#e4c977] to-[#b9954f] px-6 py-2.5 text-sm text-[#1f1a12] shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          {topBarItems.map((item, index) => (
            <div key={item.label} className="flex items-center gap-6">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="hidden h-5 w-px bg-black/15 xl:block"
                />
              ) : null}

              <TopBarServiceItem item={item} />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href={`/${locale}`}
          aria-label="Tempel Outdoor - Accueil"
          className="relative flex shrink-0 items-center"
        >
          <Image
            src="/images/logo.png"
            alt="Tempel Outdoor"
            width={240}
            height={80}
            priority
            className="h-auto w-[170px] object-contain sm:w-[190px] xl:w-[220px]"
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
                href={item.href ?? `/${locale}`}
                className="text-sm font-medium uppercase tracking-wide text-white/80 transition hover:text-[#d7b86e]"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Link
              href={favoritesHref}
              aria-label="Voir mes favoris"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-white/10 hover:text-[#d7b86e]"
            >
              <Heart className="h-5 w-5" />
            </Link>
          ) : null}

          <Link
            href={accountHref}
            aria-label={isAuthenticated ? "Mon compte" : "Connexion"}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-white/10 hover:text-[#d7b86e]"
          >
            <User className="h-5 w-5" />

            {isAuthenticated ? (
              <span
                aria-hidden="true"
                className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#d7b86e] ring-2 ring-black"
              />
            ) : null}
          </Link>

          <Link
            href={`/${locale}/cart`}
            aria-label="Voir le panier"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-white/10 hover:text-[#d7b86e]"
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
          {isAuthenticated ? (
            <Link
              href={favoritesHref}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-[#d7b86e]"
              aria-label="Voir mes favoris"
            >
              <Heart className="h-5 w-5" />
            </Link>
          ) : null}

          <Link
            href={accountHref}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-[#d7b86e]"
            aria-label={isAuthenticated ? "Mon compte" : "Connexion"}
          >
            <User className="h-5 w-5" />

            {isAuthenticated ? (
              <span
                aria-hidden="true"
                className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#d7b86e] ring-2 ring-black"
              />
            ) : null}
          </Link>

          <Link
            href={`/${locale}/cart`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-[#d7b86e]"
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

      {isMobileMenuOpen ? (
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
                    href={item.href ?? `/${locale}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between text-sm font-medium uppercase tracking-wide text-white/80 transition hover:text-[#d7b86e]"
                  >
                    {item.label}
                  </Link>
                )}

                {item.children ? (
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
                ) : null}
              </div>
            ))}

            {isAuthenticated ? (
              <Link
                href={favoritesHref}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium uppercase tracking-wide text-white/80 transition hover:border-[#d7b86e] hover:text-[#d7b86e]"
              >
                <Heart className="h-5 w-5" />
                Mes favoris
              </Link>
            ) : null}

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
      ) : null}
    </header>
  );
}