// src/components/layout/Footer.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <h3 className="mb-4 text-xl font-semibold tracking-[0.25em]">
            TEMPEL
          </h3>
          <p className="max-w-xs text-sm leading-6 text-white/60">
            Spas, saunas, loisirs et équipements fitness premium pour transformer
            vos espaces extérieurs.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-[#d7b86e]">Acheter</h4>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            <Link href="/fr/bien-etre/spa">Spa</Link>
            <Link href="/fr/bien-etre/sauna">Sauna</Link>
            <Link href="/fr/loisirs/baby-foot">Baby-foot</Link>
            <Link href="/fr/loisirs/billard">Billard</Link>
            <Link href="/fr/fitness">Fitness Premium</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-[#d7b86e]">Informations</h4>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            <Link href="/fr/a-propos">À propos</Link>
            <Link href="/fr/contact">Contact</Link>
            <Link href="/fr/cgv">CGV</Link>
            <Link href="/fr/mentions-legales">Mentions légales</Link>
            <Link href="/fr/politique-confidentialite">
              Politique de confidentialité
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-[#d7b86e]">Service client</h4>
          <p className="text-sm text-white/70">contact@tempel-outdoor.fr</p>
          <p className="mt-2 text-sm text-white/70">Livraison France & Europe</p>
          <p className="mt-2 text-sm text-white/70">Paiement sécurisé</p>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/50">
        © 2026 Tempel Outdoor. Tous droits réservés.
      </div>
    </footer>
  );
}