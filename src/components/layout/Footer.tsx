import { Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer({ locale }: { locale: string }) {
  const shopLinks = [
    { label: "Spa", href: `/${locale}/bien-etre/spa` },
    { label: "Sauna", href: `/${locale}/bien-etre/sauna` },
    { label: "Baby-foot", href: `/${locale}/loisirs/baby-foot` },
    { label: "Billard", href: `/${locale}/loisirs/billard` },
    { label: "Fitness Premium", href: `/${locale}/fitness` },
  ];

  const infoLinks = [
    { label: "À propos", href: `/${locale}/a-propos` },
    { label: "Réalisations", href: `/${locale}/realisations` },
    { label: "Contact", href: `/${locale}/contact` },
    { label: "CGV", href: `/${locale}/cgv` },
    { label: "Mentions légales", href: `/${locale}/mentions-legales` },
    { label: "Politique de confidentialité", href: `/${locale}/politique-confidentialite` },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,184,110,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="inline-flex items-center gap-3">
              <span className="text-2xl font-semibold tracking-[0.35em]">TEMPEL</span>
              <span className="text-xs font-medium tracking-[0.45em] text-[#d7b86e]">OUTDOOR</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
              Spas, saunas, loisirs et équipements fitness premium pour
              transformer vos espaces extérieurs en lieux de bien-être et de partage.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
                Livraison en France
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
                Paiement sécurisé
              </span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#d7b86e]">
              Acheter
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-white/55">
              {shopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#d7b86e]">
              Informations
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-white/55">
              {infoLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#d7b86e]">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-white/55">
              <a
                href="mailto:contact@tempel-outdoor.fr"
                className="flex items-center gap-2.5 transition hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#d7b86e]" />
                contact@tempel-outdoor.fr
              </a>
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[#d7b86e]" />
                Hérouville-en-Vexin, France
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-white/35 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Tempel Outdoor — RB Végétal. Tous droits réservés.</p>
          <p className="tracking-[0.2em] text-white/25">BIEN-ÊTRE · LOISIRS · FITNESS</p>
        </div>
      </div>
    </footer>
  );
}
