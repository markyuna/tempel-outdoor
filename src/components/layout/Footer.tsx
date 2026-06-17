import {
  ArrowUpRight,
  Globe,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const shopLinks = [
  { label: "Spa", href: "/fr/bien-etre/spa" },
  { label: "Sauna", href: "/fr/bien-etre/sauna" },
  { label: "Baby-foot", href: "/fr/loisirs/baby-foot" },
  { label: "Billard", href: "/fr/loisirs/billard" },
  { label: "Fitness Premium", href: "/fr/fitness" },
];

const infoLinks = [
  { label: "À propos", href: "/fr/a-propos" },
  { label: "Réalisations", href: "/fr/realisations" },
  { label: "Contact", href: "/fr/contact" },
  { label: "CGV", href: "/fr/cgv" },
  { label: "Mentions légales", href: "/fr/mentions-legales" },
  {
    label: "Politique de confidentialité",
    href: "/fr/politique-confidentialite",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,184,110,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <Link href="/fr" className="inline-flex items-center gap-3">
              <span className="text-2xl font-semibold tracking-[0.35em]">
                TEMPEL
              </span>
              <span className="text-xs font-medium tracking-[0.45em] text-[#d7b86e]">
                OUTDOOR
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
              Spas, saunas, loisirs et équipements fitness premium pour
              transformer vos espaces extérieurs en lieux de bien-être, de
              partage et de performance.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
                Livraison en France uniquement
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
                Paiement sécurisé
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
                Alma 2x · 3x · 4x
              </span>
            </div>
          </div>

          <FooterColumn title="Acheter" links={shopLinks} />

          <FooterColumn title="Informations" links={infoLinks} />

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#d7b86e]">
              Service client
            </h4>

            <div className="space-y-4 text-sm text-white/65">
              <a
                href="mailto:contact@tempel-outdoor.fr"
                className="group flex items-center gap-3 transition hover:text-white"
              >
                <Mail className="h-4 w-4 text-[#d7b86e]" />
                contact@tempel-outdoor.fr
              </a>

              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#d7b86e]" />
                France
              </p>

              <p className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[#d7b86e]" />
                Paiement sécurisé
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <SocialLink
                href="https://instagram.com"
                label="Instagram"
              >
                <span className="text-xs font-semibold">IG</span>
              </SocialLink>

              <SocialLink href="/fr/contact" label="Site">
                <Globe className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Tempel Outdoor. Tous droits réservés.</p>

          <p className="tracking-[0.2em] text-white/35">
            BIEN-ÊTRE · LOISIRS · FITNESS
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#d7b86e]">
        {title}
      </h4>

      <div className="flex flex-col gap-3 text-sm text-white/60">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group inline-flex w-fit items-center gap-2 transition-all duration-300 hover:translate-x-1 hover:text-white"
          >
            {link.label}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition duration-300 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-[#d7b86e]/50 hover:bg-[#d7b86e] hover:text-black"
    >
      {children}
    </Link>
  );
}